import { ImageResponse } from 'next/og';
import { getEventById } from '@/utils/events';

export const runtime = 'edge';

export const alt = 'Event Detail';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventById(id);

    // Font loading
    const fontData = await fetch(
        new URL('https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer());

    if (!event) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 48,
                        background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontFamily: '"NotoSansJP"',
                    }}
                >
                    Event Not Found
                </div>
            ),
            {
                ...size,
                fonts: [
                    {
                        name: 'NotoSansJP',
                        data: fontData,
                        style: 'normal',
                        weight: 700,
                    },
                ],
            }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: '"NotoSansJP"',
                }}
            >
                {/* Background Pattern or Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.3,
                    backgroundImage: event.thumbnail ? `url(${event.thumbnail})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(10px)',
                }} />

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    padding: '40px 80px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    borderRadius: 20,
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: '90%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                }}>
                    {/* Status Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 24px',
                        background: event.status === 'recruiting' ? '#3b82f6' : '#64748b',
                        borderRadius: 30,
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 700,
                        marginBottom: 20,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    }}>
                        {event.status === 'recruiting' ? 'キャスト募集中！' : 'イベント情報'}
                    </div>

                    {/* Title */}
                    <div style={{
                        fontSize: 64,
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1.2,
                        textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        marginBottom: 30,
                        wordBreak: 'break-word',
                    }}>
                        {event.title}
                    </div>

                    {/* Footer Branding */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 20,
                    }}>
                        <div style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: '#3b82f6',
                            marginRight: 15,
                            boxShadow: '0 0 10px #3b82f6',
                        }} />
                        <div style={{
                            fontSize: 32,
                            color: '#e2e8f0',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                        }}>
                            VR Workers
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'NotoSansJP',
                    data: fontData,
                    style: 'normal',
                    weight: 700,
                },
            ],
        }
    );
}
