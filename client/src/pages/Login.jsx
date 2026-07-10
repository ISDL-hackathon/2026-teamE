// ============================================================
// 担当: メンバー1（認証・ユーザー）
// 責務: ログイン画面。
// 実装内容:
//   - メール・パスワードの入力フォーム
//   - 送信時: await api("POST", "/auth/login", { email, password })
//     → 成功したら saveSession(token, user) して navigate("/")
//     → 失敗(401)ならエラーメッセージ表示
//   - 「新規登録はこちら」リンクで /signup へ
// 使うもの: api, saveSession (../lib/api.js), useNavigate, Link
// ============================================================
import { Link } from "react-router-dom";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api, saveSession } from "../lib/api.js";

export default function Login() {
  // TODO: 実装する
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">ログイン</h1>
      <p className="text-gray-400">TODO: メンバー1が実装する</p>
      <Link to="/signup" className="text-primary underline">
        新規登録はこちら
      </Link>
    </div>
  );
}
