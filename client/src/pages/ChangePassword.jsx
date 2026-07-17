import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("すべての項目を入力してください");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("新しいパスワードは6文字以上にしてください");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("新しいパスワードが一致しません");
      return;
    }

    try {
      setIsSubmitting(true);

      await api("PUT", "/me/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("パスワードを変更しました");
    } catch (error) {
      setErrorMessage(
        error.message || "パスワードの変更に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-6 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-4xl font-extrabold text-transparent">
            パスワードの変更
          </h1>

          <p className="mt-3 text-slate-400">
            現在のパスワードを確認して変更します
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-slate-700/70 bg-slate-900/45 p-6"
        >
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              現在のパスワード
            </label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              新しいパスワード
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="6文字以上"
              className="w-full rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              新しいパスワード（確認）
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          {errorMessage && (
            <p className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="rounded-xl border border-emerald-400/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "変更中..." : "パスワードを変更"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="mt-5 w-full rounded-xl border border-slate-600 bg-slate-900/40 px-4 py-3 font-medium text-slate-200"
        >
          プロフィールに戻る
        </button>
      </div>
    </div>
  );
}
