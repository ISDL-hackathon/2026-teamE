# ISDLove

研究室メンバーの対面コミュニケーションを促進するマッチングアプリ。
**チーム名：MTGラボ（マッチングラボ）奈良支局**

## 構成

```
ISDLove-scaffold/
├── client/   ... フロントエンド (React + Vite + Tailwind CSS)
├── server/   ... バックエンド (Node.js + Express)
└── db/       ... Supabase 用 DDL (schema.sql)
```

## セットアップ手順

### 0. 前提
- Node.js 18 以上
- Supabase プロジェクトを1つ作成し、`db/schema.sql` を SQL Editor で実行しておく

### 1. サーバー
```bash
cd server
cp .env.example .env   # SUPABASE_URL / SUPABASE_SERVICE_KEY を記入
npm install
npm run dev            # http://localhost:3000
```

### 2. クライアント
```bash
cd client
cp .env.example .env   # VITE_API_BASE を記入（デフォルトのままでも可）
npm install
npm run dev            # http://localhost:5173
```

未実装の API は `501 Not implemented` を返します。各自の担当関数を実装すると動くようになります。

## 分担表

| 担当 | 機能 | サーバー側ファイル | クライアント側ファイル |
|---|---|---|---|
| メンバー1 | 認証・ユーザー | `server/routes/auth.js`<br>`server/routes/users.js` | `client/src/pages/Login.jsx`<br>`client/src/pages/Signup.jsx`<br>`client/src/pages/Profile.jsx` |
| メンバー2 | 個人マッチング | `server/routes/matching.js` | `client/src/pages/SwipeScreen.jsx`<br>`client/src/components/SwipeCard.jsx` |
| メンバー3 | ランダムマッチング・通知 | `server/routes/random.js`<br>`server/routes/notifications.js`<br>`server/jobs/weeklyAssignment.js` | `client/src/pages/RandomIntro.jsx`<br>`client/src/pages/RandomResult.jsx`<br>`client/src/pages/Notifications.jsx` |
| メンバー4 | チャット | `server/routes/chat.js` | `client/src/pages/ChatList.jsx`<br>`client/src/pages/TalkRoom.jsx` |

**共通部（完成済み・原則編集禁止）：**
`server/index.js` / `server/lib/supabase.js` / `server/middleware/auth.js` /
`client/src/App.jsx` / `client/src/lib/api.js` / `client/src/pages/TopSenior.jsx` / `db/schema.sql`

## 開発ルール

1. **自分の担当ファイル以外は編集しない**（共通部の変更が必要なときはチームで相談）
2. **関数名・引数・返り値・APIパスは変更しない**（インターフェース確定済み）
3. 各ファイル冒頭のコメント（入出力仕様）に従って `// TODO: 実装する` の部分を埋める
4. ブランチは `feature/member1-auth` のように担当ごとに切り、main へは PR でマージ
5. 実装が終わったら該当 API を叩いて 501 が消えることを確認してから PR を出す

## API 一覧（確定仕様）

| メソッド | パス | 担当 |
|---|---|---|
| POST | /api/v1/auth/signup | メンバー1 |
| POST | /api/v1/auth/login | メンバー1 |
| GET | /api/v1/me | メンバー1 |
| PUT | /api/v1/me/profile | メンバー1 |
| GET | /api/v1/matching/candidates | メンバー2 |
| POST | /api/v1/matching/likes | メンバー2 |
| GET | /api/v1/matching/quota | メンバー2 |
| GET | /api/v1/matches | メンバー4 |
| GET | /api/v1/matches/:id/messages | メンバー4 |
| POST | /api/v1/matches/:id/messages | メンバー4 |
| GET | /api/v1/random/current | メンバー3 |
| POST | /api/v1/random/current/done | メンバー3 |
| POST | /api/v1/random/generate | メンバー3 |
| GET | /api/v1/notifications | メンバー3 |
| PUT | /api/v1/notifications/:id/read | メンバー3 |

## 主要ルール（仕様）

- いいねは B4 ⇔ 院生・先生 の縦方向のみ。**週3人まで**（月曜0:00〜日曜23:59 JST、保留はカウント外）
- 相互いいねでマッチ成立 → チャット開放
- ランダムマッチングは週次で (senior_id, week_key) にユニーク。同週内のB4重複と過去ペア再発を回避
