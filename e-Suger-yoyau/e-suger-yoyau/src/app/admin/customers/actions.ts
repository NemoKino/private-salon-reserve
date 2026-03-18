'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createCustomer(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return

  await prisma.customer.create({
    data: {
      name,
      nameKana: (formData.get('nameKana') as string) || null,
      phone: (formData.get('phone') as string) || null,
      email: (formData.get('email') as string) || null,
      lineName: (formData.get('lineName') as string) || null,
      instagramName: (formData.get('instagramName') as string) || null,
      birthday: formData.get('birthday') ? new Date(formData.get('birthday') as string) : null,
      notes: (formData.get('notes') as string) || null,
    },
  })

  redirect('/admin/customers')
}

export async function updateCustomer(id: string, formData: FormData) {
  await prisma.customer.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      nameKana: (formData.get('nameKana') as string) || null,
      phone: (formData.get('phone') as string) || null,
      email: (formData.get('email') as string) || null,
      lineName: (formData.get('lineName') as string) || null,
      instagramName: (formData.get('instagramName') as string) || null,
      birthday: formData.get('birthday') ? new Date(formData.get('birthday') as string) : null,
      notes: (formData.get('notes') as string) || null,
    },
  })

  redirect(`/admin/customers/${id}`)
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } })
  redirect('/admin/customers')
}
