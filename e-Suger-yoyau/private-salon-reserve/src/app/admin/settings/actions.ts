'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateBusinessHours(formData: FormData) {
  const weekdays = [0, 1, 2, 3, 4, 5, 6]
  
  for (const day of weekdays) {
    const openTime = (formData.get(`openTime_${day}`) as string) || '10:00'
    const closeTime = (formData.get(`closeTime_${day}`) as string) || '19:00'
    const isClosed = formData.get(`isClosed_${day}`) === 'on'

    await prisma.businessHour.upsert({
      where: { id: `weekday-${day}` }, // We can use a stable ID for weekdays
      update: { openTime, closeTime, isClosed },
      create: { id: `weekday-${day}`, weekday: day, openTime, closeTime, isClosed },
    })
  }

  revalidatePath('/admin/settings')
}

export async function addHoliday(formData: FormData) {
  const holidayDateStr = formData.get('holidayDate') as string
  const holidayDate = new Date(holidayDateStr)
  
  if (isNaN(holidayDate.getTime())) {
    throw new Error('無効な日付です。')
  }

  const note = formData.get('note') as string
  const isClosed = formData.get('isClosed') === 'on'
  const openTime = !isClosed ? (formData.get('openTime') as string) || '10:00' : null
  const closeTime = !isClosed ? (formData.get('closeTime') as string) || '19:00' : null

  await prisma.holiday.create({
    data: { holidayDate, isClosed, openTime, closeTime, note },
  })

  revalidatePath('/admin/settings')
}

export async function deleteHoliday(id: string) {
  await prisma.holiday.delete({ where: { id } })
  revalidatePath('/admin/settings')
}
