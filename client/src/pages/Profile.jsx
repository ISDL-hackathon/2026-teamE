import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  api,
  clearSession,
  getSessionUser,
  saveSession,
} from "../lib/api.js";

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await api("GET", "/me");
        const user = data.user;

        setName(user.name ?? "");
        setRole(user.role ?? "");
        setBio(user.bio ?? "");
        setAvatarUrl(user.avatar_url ?? "");
      } catch (error) {
        setErrorMessage(
          error.message || "プロフィールの取得に失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("名前を入力してください");
      return;
    }

    try {
      setIsSaving(true);

      const data = await api("PUT", "/me/profile", {
        name: name.trim(),
        bio,
        avatar_url: avatarUrl,
      });

      const currentUser = getSessionUser();
      const token = localStorage.getItem("token");

      if (currentUser && token) {
        saveSession(token, {
          ...currentUser,
          ...data.user,
        });
      }

      setName(data.user.name ?? "");
      setRole(data.user.role ?? "");
      setBio(data.user.bio ?? "");
      setAvatarUrl(data.user.avatar_url ?? "");

      setSuccessMessage("保存しました");
    } catch (error) {
      setErrorMessage(
        error.message || "プロフィールの保存に失敗しました"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] px-6 py-10">
        <p className="text-center text-slate-400">
          プロフィールを読み込んでいます...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-6 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-4xl font-extrabold text-transparent">
            プロフィール
          </h1>

          <p className="mt-3 text-slate-400">
            あなたの情報を編集できます
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-slate-700/70 bg-slate-900/45 p-6"
        >
          <div className="flex justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="プロフィール画像"
                className="h-28 w-28 rounded-full border border-slate-600 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-slate-600 bg-gradient-to-br from-fuchsia-400 via-violet-500 to-indigo-500 text-3xl font-bold text-white">
  {name ? name.charAt(0) : "?"}
</div>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              氏名
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              ユーザー属性
            </label>

            <input
              id="role"
              type="text"
              value={role}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              自己紹介
            </label>

            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={5}
              wrap="soft"
              placeholder="研究内容や趣味などを書いてください"
              className="w-full resize-none overflow-x-hidden break-words rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="avatarUrl"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              アイコン画像URL
            </label>

            <input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.png"
              className="w-full rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
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
            disabled={isSaving}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "保存中..." : "保存"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/profile/password")}
          className="mt-6 w-full rounded-xl border border-slate-600 bg-slate-900/40 px-4 py-3 font-medium text-slate-200"
        >
          パスワードを変更
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-3 font-medium text-red-300"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}