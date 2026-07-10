// ============================================================
// 担当: 共通部（完成済み・編集禁止）
// 責務: バックエンドAPIの fetch ラッパー。
//        全ページはこの api() を通してサーバーと通信する。
//        JWT は localStorage("token") に保存し自動で付与する。
// 使い方:
//   const data = await api("GET", "/matching/quota");
//   const data = await api("POST", "/matching/likes", { to_user_id, action: "LIKE" });
// ============================================================
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function api(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

// ---- 認証状態のヘルパー（完成済み） ----
export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
export function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}
export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
