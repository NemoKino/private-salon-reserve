
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata = {
    title: 'このサイトについて | VRC Workers',
    description: 'VRC Workersの運営目的と管理者について',
};

export default function AboutPage() {
    const adminName = process.env.NEXT_PUBLIC_ADMIN_DISPLAY_NAME || '管理者';
    const adminTwitterId = process.env.NEXT_PUBLIC_ADMIN_TWITTER_ID || 'vrc_workers';
    const portfolioMode = process.env.NEXT_PUBLIC_PORTFOLIO_MODE === 'true';
    const adminImage = process.env.NEXT_PUBLIC_ADMIN_IMAGE_URL || '/images/22CB5329-1156-4C80-9420-57CF569D7536VRChat_2024-10-23_00-48-35.625_3840x2160.png';

    return (
        <>
            <Header />
            <main className={styles.container}>
                <section className={styles.section}>
                    <h1 className={styles.title}>このサイトについて</h1>
                    <p className={styles.text}>
                        こんにちは！VRC Workersへようこそ。<br />
                        このサイトは、「VRChatのイベントをもっと盛り上げたい！」というシンプルな想いから生まれました。
                    </p>
                    <p className={styles.text}>
                        イベントを開きたいけどキャストが集まらない、逆にキャストをやってみたいけどどこで募集しているかわからない……。<br />
                        そんな「キャスト募集」のハードルを少しでも下げて、もっと気軽にイベント開催やキャスト参加ができるようになったらいいなと思い、このサイトを作りました。
                    </p>
                    {!portfolioMode && (
                        <p className={styles.text}>
                            個人で運営しているため、至らぬ点や使いにくい部分も多々あるかと思います。<br />
                            「ここを直してほしい」「こんな機能がほしい」といったご要望は随時受け付けておりますので、気兼ねなくご連絡いただけると嬉しいです！
                        </p>
                    )}
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subTitle}>管理者について</h2>
                    <div className={styles.profileCard}>
                        <div className={styles.adminImageWrapper}>
                            <Image
                                src={adminImage}
                                alt="Admin Avatar"
                                width={600}
                                height={338}
                                className={styles.adminImage}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                        <div className={styles.adminInfo}>
                            <span className={styles.adminName}>管理者: {adminName}</span>
                            <a href={`https://x.com/${adminTwitterId.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                X (Twitter): {adminTwitterId.startsWith('@') ? adminTwitterId : `@${adminTwitterId}`}
                            </a>
                        </div>

                        {!portfolioMode && (
                            <>
                                <div className={styles.avatarList}>
                                    <div className={styles.avatarTitle}>よく使うアバター</div>
                                    <div className={styles.avatars}>
                                        <span className={styles.avatarTag}>ルナト</span>
                                        <span className={styles.avatarTag}>墨惺</span>
                                        <span className={styles.avatarTag}>凪</span>
                                        <span className={styles.avatarTag}>彼方</span>
                                    </div>
                                </div>

                                <p className={styles.text} style={{ marginBottom: 0 }}>
                                    VRChatで気ままに遊んでいます。<br />
                                    PublicやFriend+などで見かけたら、ぜひ気軽に話しかけてくださいね！
                                </p>
                            </>
                        )}
                        {portfolioMode && (
                            <p className={styles.text} style={{ marginBottom: 0 }}>
                                VRコミュニティの利便性向上を目指し、Next.jsやTypescriptを用いて開発を行っています。<br />
                                技術的な詳細やアーキテクチャについては、リポジトリのドキュメントをご参照ください。
                            </p>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
