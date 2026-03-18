# Private Salon Reserve (DEMO)

プライベートサロン向けの、高級感のある予約管理システムです。
特定の店舗に依存しない汎用的なデモ版として構成されています。

## 特徴

- **Dark Gothic Luxe デザイン**: 黒とクリムゾンレッドを基調とした、エレガントでプレミアムなユーザーインターフェース。
- **6ステップ予約フロー**: 顧客が迷わず予約を完了できる、直感的で確認ステップを含めた安心のフロー。
- **管理者向けカレンダー**: `react-big-calendar` をカスタマイズし、予約状況を一目で把握可能。クリックで詳細（顧客名、メモ等）を表示。
- **柔軟なスケジュール管理**: 曜日ごとの営業設定に加え、特定の日付に対して「臨時休業」や「午後の営業のみ」といった詳細なカスタマイズが可能。
- **レスポンシブ対応**: スマートフォン、タブレット、PCのすべてのデバイスで快適に操作可能。

## 技術スタック

- **Frontend**: Next.js 15+ (App Router, Turbopack), React 19
- **Database**: Prisma (SQLite)
- **Styling**: Vanilla CSS (CSS Modules)
- **Authentication**: JWT & HTTP-only Cookies
- **Libraries**: date-fns, react-big-calendar, bcryptjs, jose

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. データベースのセットアップ
```bash
npx prisma db push
```

### 3. 初期データの投入（管理者作成）
```bash
npx tsx src/scripts/seed-admin.ts
```
※ 初期ログイン情報は、ユーザー名: `owner` / パスワード: `password123` です。

### 4. 開発サーバーの起動
```bash
npm run dev
```

## 注意事項

- 本プロジェクトはデモ用であり、本番環境で利用する場合は適切なデータベース（PostgreSQL等）への移行とセキュリティ設定の強化を推奨します。
- ブラウザ拡張機能の影響による表示の不一致（Hydration Error）を抑制するため、`suppressHydrationWarning` を設定しています。

## ライセンス

MIT License
