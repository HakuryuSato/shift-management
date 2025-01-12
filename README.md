# シフト管理 + QR出退勤管理アプリ
実際に運用を行っている シフト / 出退勤の管理アプリとなります。  

本番環境同様の機能をテストいただけますが、
データなどはデモ用となります。

デモ用サイトパスワード：  
デモ用ユーザー名：  
デモ用管理者パスワード：  

デモ用ユーザーリンク：  
デモ用管理者リンク:  

デモ用出退勤打刻QR


## 使用技術概略(詳細後述)
- フロントエンド: React( Material-UI / FullCalendar )
- バックエンド: Nextjs(API Routes) + supabase

## 実装機能一覧
### シフト関連機能
- シフト希望 提出 / まとめて提出 / 毎月自動登録
- シフト混雑状況表示
- シフト表Excelダウンロード

### 出退勤関連機能
- QR読み取りによる出退勤打刻
- 勤務時間集計
- 集計結果Excelダウンロード


## 使用技術詳細
### 共通
- フレームワーク: Nextjs
- 言語: TypeScript
- テスト: Jest
- 静的解析: ESLint

### フロントエンド
- カレンダーUI: FullCalendar
- その他UI: Material-UI
- 状態管理: Zustand
- QR読み取り：yudiel/react-qr-scanner

### バックエンド
- サーバーレス関数: Nextjs API Routes / Server Actions
- データベース: supabase
- 認証: NextAuth
- シフト自動登録用: Vercel Cron Jobs
- 祝日用API: Holidays JP API
- Excel生成用: exceljs

## インフラ構成図
![インフラ構成図](documents/6_インフラ構成図.png)
