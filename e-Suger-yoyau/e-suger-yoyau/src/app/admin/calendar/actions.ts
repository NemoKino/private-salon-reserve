// Server-side data fetcher (not a Server Action)

import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function getReservations(year: number, month: number) {
    // Simple fetching for the current month
    const startDate = startOfMonth(new Date(year, month))
    const endDate = endOfMonth(new Date(year, month))

    const reservations = await prisma.reservation.findMany({
        where: {
            startAt: {
                gte: startDate,
                lte: endDate,
            }
        },
        include: {
            customer: true,
            menu: true,
        }
    })

    // Format to standard events array for React Big Calendar
    return reservations.map(res => ({
        id: res.id,
        title: `${res.customer.name} - ${res.menu.name}`,
        start: res.startAt,
        end: res.endAt,
        status: res.status,
        resource: res,
    }))
}
