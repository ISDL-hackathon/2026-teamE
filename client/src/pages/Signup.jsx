// ============================================================
// 担当: メンバー1（認証・ユーザー）
// 責務: 新規登録画面。
// 実装内容:
//   - 氏名・メール・パスワードの入力フォーム
//   - ユーザー属性の選択:
//       「学部4年生」→ role = "B4"
//       「それ以外（院生・先生）」→ さらに M1 / M2 / FACULTY を選択
//   - 送信時: await api("POST", "/auth/signup", { name, email, password, role })
//     → 成功したら saveSession(token, user) して navigate("/")
//     → 409 ならメール重複エラー表示
// 使うもの: api, saveSession (../lib/api.js), useNavigate
// ============================================================

export default function Signup() {
  // TODO: 実装する
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">新規登録</h1>
      <p className="text-gray-400">TODO: メンバー1が実装する</p>
    </div>
  );
}
