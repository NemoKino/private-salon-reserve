'use client';

import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const handleShareTwitter = () => {
        const currentUrl = url || window.location.href;
        const text = encodeURIComponent(`${title}\n#VR_CAST_LINK`);
        const link = encodeURIComponent(currentUrl);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${link}`, '_blank');
    };

    return (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>このイベントをシェア:</span>
            {/* Direct button styling is not supported by Button component props, so we rely on variant */}
            <div style={{ display: 'inline-block' }}>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleShareTwitter}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                        Post
                    </span>
                </Button>
            </div>
        </div>
    );
}
