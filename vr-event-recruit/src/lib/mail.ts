import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a notification email to the administrator when a new event is applied.
 */
export async function sendAdminNotification(eventData: {
    title: string;
    organizerName: string;
    twitterId: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Skipping email notification.');
        return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.warn('ADMIN_EMAIL is not set. Skipping email notification.');
        return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    try {
        await resend.emails.send({
            from: 'VRC Workers <noreply@vrc-workers.com>',
            to: adminEmail,
            subject: `【新着申請】${eventData.title}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0ea5e9;">新しいイベント申請がありました</h2>
                    <p>VRC Workers に新しいイベントの掲載申請が届きました。</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <p style="margin: 0;"><strong>イベント名:</strong> ${eventData.title}</p>
                        <p style="margin: 10px 0 0 0;"><strong>主催者:</strong> ${eventData.organizerName} (@${eventData.twitterId})</p>
                        <p style="margin: 10px 0 0 0;"><strong>申請日時:</strong> ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
                    </div>

                    <p style="margin-top: 25px;">
                        <a href="${siteUrl}/admin" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            管理者画面で詳細を確認・承認する
                        </a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #94a3b8;">
                        ※このメールは VRC Workers のシステムより自動送信されています。
                    </p>
                </div>
            `,
        });
    } catch (error) {
        console.error('Failed to send admin notification email:', error);
    }
}
