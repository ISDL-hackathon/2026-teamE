import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, saveSession } from "../lib/api.js";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!name || !password) {
      setErrorMessage("名前とパスワードを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await api("POST", "/auth/login", {
        name,
        password,
      });

      saveSession(data.token, data.user);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "ログインに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col">
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-7 flex h-36 w-36 items-center justify-center rounded-[32px] border border-indigo-400/60 bg-indigo-950/60 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
            <div className="relative h-20 w-24">
              <div className="absolute left-1 top-0 h-5 w-5 rounded-full bg-blue-300" />
              <div className="absolute right-1 top-0 h-5 w-5 rounded-full bg-pink-300" />

              <div className="absolute left-2 top-5 h-14 w-10 rotate-[-35deg] rounded-full border-[8px] border-blue-400 border-r-transparent border-t-transparent" />
              <div className="absolute right-2 top-5 h-14 w-10 rotate-[35deg] rounded-full border-[8px] border-pink-400 border-l-transparent border-t-transparent" />

              <div className="absolute left-1/2 top-[44px] h-3 w-3 -translate-x-1/2 rotate-45 bg-fuchsia-300" />
            </div>
          </div>

          <h1 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent">
            ISDLove
          </h1>

          <p className="mt-4 text-center text-lg text-slate-400">
            研究室の出会いを、もっとスマートに。
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 w-full max-w-2xl space-y-5"
          >
            <div className="flex items-center rounded-2xl border border-slate-600/70 bg-slate-900/35 px-5 py-4">
              <span className="mr-4 text-2xl text-slate-400">👤</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="名前"
                autoComplete="name"
                className="w-full bg-transparent text-lg text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center rounded-2xl border border-slate-600/70 bg-slate-900/35 px-5 py-4">
              <span className="mr-4 text-2xl text-slate-400">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="パスワード"
                autoComplete="current-password"
                className="w-full bg-transparent text-lg text-white outline-none placeholder:text-slate-500"
              />
            </div>

            {errorMessage && (
              <p className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 px-6 py-4 text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </main>

        <div className="flex justify-end pb-4 pt-8">
          <Link
            to="/signup"
            className="text-lg font-medium text-indigo-300 hover:text-indigo-200"
          >
            新規登録の方はこちら →
          </Link>
        </div>
      </div>
    </div>
  );
}