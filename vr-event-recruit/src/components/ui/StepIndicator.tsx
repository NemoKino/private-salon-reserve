import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { number: 1, label: 'ご入力' },
        { number: 2, label: 'プレビュー' },
        { number: 3, label: '本人確認' },
        { number: 4, label: '完了' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.stepWrapper}>
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;
                    const isLast = index === steps.length - 1;

                    return (
                        // Use Fragment to return multiple elements (Step + Connector)
                        <div key={step.number} style={{ display: 'contents' }}>
                            <div className={styles.stepItem}>
                                <div
                                    className={`
                                        ${styles.circle}
                                        ${isActive ? styles.circleActive : ''}
                                        ${isCompleted ? styles.circleCompleted : ''}
                                    `}
                                >
                                    {isCompleted ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <span
                                    className={`
                                        ${styles.label}
                                        ${isActive || isCompleted ? styles.labelActive : ''}
                                    `}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Render connector if not the last item */}
                            {!isLast && (
                                <div
                                    className={`
                                        ${styles.connector}
                                        ${currentStep > step.number ? styles.connectorActive : ''}
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
