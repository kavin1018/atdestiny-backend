import { User } from '@prisma/client';
import authRepository from './auth.repository.js';
import BcryptUtil from '../../shared/utils/bcrypt.util.js';
import JWTUtil, { TokenPayload } from '../../shared/utils/jwt.util.js';
import { UnauthorizedException, ConflictException } from '../../shared/exceptions/index.js';
import { RegisterDto, LoginDto, TokenResponseDto } from './dto/auth.dto.js';


export class AuthService {
    async register(registerDto: RegisterDto): Promise<{ user: Partial<User> }> {
        const existingUser = await authRepository.findUserByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await BcryptUtil.hash(registerDto.password);

        const newUser = await authRepository.createUser({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
            phone: registerDto.phone,
            role: 'USER', // Default role
        });

        const { password, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword };
    }

    async login(loginDto: LoginDto): Promise<{ user: Partial<User>, tokens: TokenResponseDto }> {
        const user = await authRepository.findUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await BcryptUtil.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const tokens = await this.generateTokens(user);

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, tokens };
    }

    async refreshToken(token: string): Promise<TokenResponseDto> {
        const storedToken = await authRepository.findRefreshToken(token);

        if (!storedToken || storedToken.isRevoked) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Verify JWT signature
        let payload: TokenPayload;
        try {
            payload = JWTUtil.verifyRefreshToken(token);
        } catch (error) {
            throw new UnauthorizedException('Expired refresh token');
        }

        // Basic rotation: revoke old token
        await authRepository.revokeRefreshToken(token);

        const user = await authRepository.findUserById(payload.userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.generateTokens(user);
    }

    async logout(token: string): Promise<void> {
        await authRepository.revokeRefreshToken(token);
    }

    private async generateTokens(user: User): Promise<TokenResponseDto> {
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = JWTUtil.generateAccessToken(payload);
        const refreshToken = JWTUtil.generateRefreshToken(payload);

        // Save refresh token to DB
        // Parse '7d' to date logic briefly here or in repository, 
        // for simplicity assuming strict day implementation based on config string is needed, 
        // but here I'll just add 7 days to current date directly for MVP
        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

        await authRepository.saveRefreshToken(user.id, refreshToken, refreshExpiresAt);

        return {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15m in seconds usually
        };
    }
}

export default new AuthService();
