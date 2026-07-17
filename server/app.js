// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: Express アプリ本体（ミドルウェア設定と全ルーティング定義）。
//        ローカル開発では index.js から、Vercel では api/index.js から
//        この app を読み込んで使う。
// ============================================================
import "dotenv/config";
import express from "express";
import cors from "cors";

import { requireAuth } from "./middleware/auth.js";

// --- メンバー1: 認証・ユーザー ---
import { signup, login } from "./routes/auth.js";
import { getMe, updateProfile, changePassword } from "./routes/users.js";

// --- メンバー2: 個人マッチング ---
import { getCandidates, sendLike, getQuota } from "./routes/matching.js";

// --- メンバー3: ランダムマッチング・通知 ---
import { getCurrentAssignment, markAssignmentDone, generateAssignments } from "./routes/random.js";
import { getNotifications, markNotificationRead } from "./routes/notifications.js";

// --- メンバー4: チャット ---
import { getMatches, getMessages, sendMessage } from "./routes/chat.js";

const app = express();
app.use(cors());
app.use(express.json());

const api = express.Router();
app.use("/api/v1", api);

// ---------- 認証（トークン不要） ----------
api.post("/auth/signup", signup);
api.post("/auth/login", login);

// ---------- 以降はすべて要ログイン ----------
api.use(requireAuth);

// ユーザー（メンバー1）
api.get("/me", getMe);
api.put("/me/profile", updateProfile);
api.put("/me/password", changePassword);

// 個人マッチング（メンバー2）
api.get("/matching/candidates", getCandidates);
api.post("/matching/likes", sendLike);
api.get("/matching/quota", getQuota);

// チャット（メンバー4）
api.get("/matches", getMatches);
api.get("/matches/:id/messages", getMessages);
api.post("/matches/:id/messages", sendMessage);

// ランダムマッチング（メンバー3）
api.get("/random/current", getCurrentAssignment);
api.post("/random/current/done", markAssignmentDone);
api.post("/random/generate", generateAssignments);

// 通知（メンバー3）
api.get("/notifications", getNotifications);
api.put("/notifications/:id/read", markNotificationRead);

// ---------- ヘルスチェック ----------
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;
