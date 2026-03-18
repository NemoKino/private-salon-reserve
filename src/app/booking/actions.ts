'use server'

import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, addMinutes, format, parse } from 'date-fns'

export async function getAvailableTimes(dateStr: string, menuId: string) {
  const date = new Date(dateStr)
  const weekday = date.getDay()
  
  // 1. Get business hours for this day
  const businessHour = await prisma.businessHour.findFirst({
    where: { weekday }
  })
  
  // 2. Check if it's a holiday or special day
  const customDay = await prisma.holiday.findUnique({
    where: { holidayDate: startOfDay(date) }
  })
  
  if (customDay) {
    if (customDay.isClosed) return []
  } else {
    if (!businessHour || businessHour.isClosed) return []
  }

  // 3. Get existing reservations for this day
  const existingReservations = await prisma.reservation.findMany({
    where: {
      startAt: { gte: startOfDay(date), lte: endOfDay(date) },
      status: { in: ['reserved', 'visited'] }
    }
  })

  // 4. Get menu duration
  const menu = await prisma.menu.findUnique({ where: { id: menuId } })
  if (!menu) return []
  const duration = menu.durationMinutes

  // 5. Generate time slots (every 30 mins)
  const slots: string[] = []
  const openT = customDay?.openTime || businessHour?.openTime || '10:00'
  const closeT = customDay?.closeTime || businessHour?.closeTime || '19:00'

  let current = parse(openT, 'HH:mm', date)
  const close = parse(closeT, 'HH:mm', date)

  while (addMinutes(current, duration) <= close) {
    const slotStart = current
    const slotEnd = addMinutes(current, duration)
    
    // Check overlap with existing reservations
    const isOverlap = existingReservations.some(res => {
      return (slotStart < res.endAt && slotEnd > res.startAt)
    })

    // Also check if it's in the past (if date is today)
    const isPast = slotStart < new Date()

    if (!isOverlap && !isPast) {
      slots.push(format(slotStart, 'HH:mm'))
    }
    
    current = addMinutes(current, 30)
  }

  return slots
}

export async function createReservation(data: {
  menuId: string
  startAt: string
  name: string
  phone: string
  email: string
  memo?: string
}) {
  const menu = await prisma.menu.findUnique({ where: { id: data.menuId } })
  if (!menu) throw new Error('Menu not found')

  const startAt = new Date(data.startAt)
  const endAt = addMinutes(startAt, menu.durationMinutes)

  // Double check availability
  const conflict = await prisma.reservation.findFirst({
    where: {
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      status: { in: ['reserved', 'visited'] }
    }
  })
  if (conflict) return { error: '申し訳ありません。この時間は既に予約されています。' }

  // Check if customer exists by email or phone
  let customer = await prisma.customer.findFirst({
    where: {
      OR: [
        { email: data.email },
        { phone: data.phone }
      ]
    }
  })

  if (customer) {
    // Update existing customer
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        lastVisitAt: new Date(), // This will be updated again on actual visit
        // We don't increment visitCount here, it should be done upon "visited" status
      }
    })
  } else {
    // Create new customer
    customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        firstVisitAt: new Date(),
      }
    })
  }

  const reservation = await prisma.reservation.create({
    data: {
      customerId: customer.id,
      menuId: data.menuId,
      startAt,
      endAt,
      memo: data.memo,
      source: 'web',
      status: 'reserved'
    }
  })

  return { success: true, reservationId: reservation.id }
}
