import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/app/about/page.module.css'; // Reusing about styles for consistency

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>利用規約</h1>

                    <div className={styles.section}>
                        <p>この利用規約（以下「本規約」といいます。）は、VR Workers（以下「当サイト」といいます。）が提供するサービス（以下「本サービス」といいます。）の利用条件を定めるものです。</p>
                    </div>

                    <div className={styles.section}>
                        <h2>第1条（適用）</h2>
                        <ul className={styles.list}>
                            <li>本規約は、ユーザーと当サイトとの間の本サービスの利用に関わる一切の関係に適用されるものとします。</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>第2条（禁止事項）</h2>
                        <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                        <ul className={styles.list}>
                            <li>法令または公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
                            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                            <li>不正アクセスをし、またはこれを試みる行為</li>
                            <li>他のユーザーに成りすます行為</li>
                            <li>当サイトのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                            <li>その他、当サイトが不適切と判断する行為</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>第3条（本サービスの提供の停止等）</h2>
                        <p>当サイトは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
                        <ul className={styles.list}>
                            <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                            <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                            <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                            <li>その他、当サイトが本サービスの提供が困難と判断した場合</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>第4条（免責事項）</h2>
                        <ul className={styles.list}>
                            <li>当サイトの債務不履行責任は、当サイトの故意または重過失によらない場合には免責されるものとします。</li>
                            <li>当サイトは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2>第5条（利用規約の変更）</h2>
                        <p>当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
