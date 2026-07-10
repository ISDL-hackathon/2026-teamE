// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: JWT 認証ミドルウェア。
//        Authorization: Bearer <token> を検証し、
//        req.user = { id, role } をセットする。
//        トークンの発行（署名）はメンバー1が auth.js の login/signup 内で
//        signToken() を使って行う。
// ============================================================
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

/** ログイン必須ミドルウェア（完成済み） */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "認証が必要です" });
  }
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "トークンが無効です" });
  }
}

/**
 * JWT を発行する（完成済み）
 * メンバー1が signup / login 実装時に呼ぶ。
 * @param {{ id: string, role: "B4"|"M1"|"M2"|"FACULTY" }} user
 * @returns {string} token（有効期限 7 日）
 */
export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "7d" });
}
