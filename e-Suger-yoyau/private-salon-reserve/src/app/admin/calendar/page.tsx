export const dynamic = 'force-dynamic'

import AdminCalendar from '@/components/AdminCalendar'
import { getReservations } from './actions'

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams

    // デフォルトは現在の年月
    const now = new Date()
    const year = params.year ? parseInt(params.year as string) : now.getFullYear()
    const month = params.month ? parseInt(params.month as string) - 1 : now.getMonth()

    const reservations = await getReservations(year, month)

    // JSONシリアライズ可能な形にするため、Dateオブジェクトを文字列に変換して渡す
    const serializedEvents = reservations.map(r => ({
        ...r,
        start: r.start.toISOString(),
        end: r.end.toISOString(),
    }))

    return (
        <div>
            <AdminCalendar initialEvents={serializedEvents as unknown as any} />
        </div>
    )
}
