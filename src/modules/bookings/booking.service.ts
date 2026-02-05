import bookingRepository from './booking.repository.js';
import serviceRepository from '../services/service.repository.js';
import { NotFoundException, BadRequestException } from '../../shared/exceptions/index.js';
import { Booking, BookingStatus } from '@prisma/client';

export class BookingService {
    async createBooking(userId: string, data: any): Promise<Booking> {
        const service = await serviceRepository.findById(data.serviceId);
        if (!service) {
            throw new NotFoundException('Service not found');
        }

        let totalAmount = service.basePrice;
        let packageId = undefined;

        if (data.packageId) {
            const selectedPackage = service.packages.find(p => p.id === data.packageId);
            if (!selectedPackage) {
                throw new BadRequestException('Invalid package for this service');
            }
            totalAmount = selectedPackage.price;
            packageId = selectedPackage.id;
        }

        // Convert string date to Date object if needed, ensuring strict ISO compliance
        const bookingDate = new Date(data.bookingDate);

        return bookingRepository.create({
            user: { connect: { id: userId } },
            service: { connect: { id: data.serviceId } },
            package: packageId ? { connect: { id: packageId } } : undefined,
            bookingDate: bookingDate,
            bookingTime: data.bookingTime,
            location: data.location,
            notes: data.notes,
            totalAmount: totalAmount,
            status: 'PENDING',
        });
    }

    async getAllBookings(query: any): Promise<{ bookings: Booking[]; total: number; page: number; limit: number }> {
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.userId) {
            where.userId = query.userId;
        }

        const [bookings, total] = await bookingRepository.findAll({
            skip,
            take: limit,
            where,
        });

        return { bookings, total, page, limit };
    }

    async getBookingById(id: string, userId?: string): Promise<Booking> {
        const booking = await bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // specific check for regular users
        if (userId && booking.userId !== userId) {
            throw new NotFoundException('Booking not found'); // Hide existence
        }

        return booking;
    }

    async updateBookingStatus(id: string, status: BookingStatus, adminNotes?: string): Promise<Booking> {
        const booking = await bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        const updateData: any = { status };
        if (adminNotes) {
            updateData.adminNotes = adminNotes;
        }

        // Auto-timestamp updates
        if (status === 'CONFIRMED') updateData.confirmedAt = new Date();
        if (status === 'COMPLETED') updateData.completedAt = new Date();
        if (status === 'CANCELLED') updateData.cancelledAt = new Date();

        return bookingRepository.update(id, updateData);
    }
}

export default new BookingService();
