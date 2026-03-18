'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createMenu(formData: FormData) {
  await prisma.menu.create({
    data: {
      name: formData.get('name') as string,
      price: parseInt(formData.get('price') as string) || 0,
      durationMinutes: parseInt(formData.get('durationMinutes') as string) || 60,
      description: (formData.get('description') as string) || null,
      isPublic: formData.get('isPublic') === 'true',
      targetType: (formData.get('targetType') as string) || 'all',
    },
  })
  redirect('/admin/menus')
}

export async function updateMenu(id: string, formData: FormData) {
  await prisma.menu.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      price: parseInt(formData.get('price') as string) || 0,
      durationMinutes: parseInt(formData.get('durationMinutes') as string) || 60,
      description: (formData.get('description') as string) || null,
      isPublic: formData.get('isPublic') === 'true',
      targetType: (formData.get('targetType') as string) || 'all',
    },
  })
  redirect('/admin/menus')
}

export async function deleteMenu(id: string) {
  await prisma.menu.delete({ where: { id } })
  redirect('/admin/menus')
}

export async function toggleMenuPublic(id: string, isPublic: boolean) {
  await prisma.menu.update({ where: { id }, data: { isPublic } })
  redirect('/admin/menus')
}
