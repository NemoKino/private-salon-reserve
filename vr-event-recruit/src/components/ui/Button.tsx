import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    external?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    style?: React.CSSProperties;
}

export default function Button({
    children,
    href,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    external = false,
    type = 'button',
    disabled = false,
    style,
}: ButtonProps) {
    const rootClassName = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

    if (href) {
        if (external) {
            return (
                <a href={href} className={rootClassName} target="_blank" rel="noopener noreferrer" style={style}>
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} className={rootClassName} style={style}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={rootClassName}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children}
        </button>
    );
}
