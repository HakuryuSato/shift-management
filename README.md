# シフト/出退勤管理アプリ
実務案件として納品したシフト/出退勤の管理アプリとなります。  
利用者数は約20名で現在も運用保守を行っております。  

<img src="https://github.com/user-attachments/assets/12b19efc-2876-4b1a-ba4e-48b19de6ee9c" height="200" />
<img src="https://github.com/user-attachments/assets/07945322-e13b-4c9a-bf73-94ddfd4e87c4" height="200" />

本番環境同様の機能をテストいただけますが、
データなどはデモ用となります。

## デモ用ID / PW
デモ用サイトパスワード：準備中  
デモ用ユーザー名： 準備中  
デモ用管理者パスワード： 準備中  

## デモ用リンク
デモ用ユーザーリンク（スマホ推奨）：  準備中  
デモ用管理者リンク（PC推奨）:  準備中  

## デモ用出退勤打刻QR
![ATTENDANCE_QR](https://github.com/user-attachments/assets/018e06c6-3f83-4142-a142-5dac9367729a)



## 実装機能一覧
### 共通機能
- ログイン機能

#### 利用者側
- シフト希望提出 / 複数日まとめて提出
- QRコードによる出退勤打刻

#### 管理者側
- 全員のシフト希望確認・変更
- 出退勤の打刻データから勤務時間の自動計算/集計
- 集計された勤務データの編集
- 各種Excelダウンロード

### ユーザー要望により追加された機能
- シフト混雑状況の可視化
- シフト自動登録機能
- 全員のシフト閲覧

### 追加予定の機能
- 会社の休日登録（夏季休暇など）
- お知らせ
- 使い方


## 使用技術
### 共通
- フレームワーク: Nextjs
- 言語: TypeScript
- テスト: Jest
- 静的解析: ESLint

### フロントエンド
#### 主要ライブラリ
- FullCalendar（カレンダーUI）
- Material-UI（UI） 
- Zustand（状態管理）
- yudiel/react-qr-scanner（QR読み取り）

### バックエンド
#### 主要ライブラリ
- supabase
- Nextjs API Routes / Server Actions
- NextAuth（認証）
- Holidays JP API（祝日用API）
- exceljs（Excel生成用）

### インフラ
- Vercel

#### 利用サービス
- Cron Jobs (シフト固定ユーザーのための自動登録用)
- 

## インフラ構成図
![インフラ構成図](documents/6_インフラ構成図.png)

## ER図
![ER図](documents/5_ER図.png)
