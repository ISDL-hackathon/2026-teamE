// ============================================================
// 担当: メンバー1（認証・ユーザー）
// 責務: プロフィール画面。編集可能な状態で表示し、保存ボタンで更新する。
// 実装内容:
//   - 初期表示: await api("GET", "/me") で現在の値をフォームに入れる
//   - フォーム項目: name / bio / avatar_url（role・email は表示のみ・変更不可）
//   - 保存ボタン: await api("PUT", "/me/profile", { name, bio, avatar_url })
//     → 成功したら「保存しました」を表示し、localStorage の user も更新
//   - ログアウトボタン: clearSession() して navigate("/login")
// 使うもの: api, saveSession, clearSession (../lib/api.js)
// ============================================================

export default function Profile() {
  // TODO: 実装する
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">プロフィール</h1>
      <p className="text-gray-400">TODO: メンバー1が実装する</p>
    </div>
  );
}
