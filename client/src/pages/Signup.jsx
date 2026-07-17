import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, saveSession } from "../lib/api.js";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("B4");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!name || !password) {
      setErrorMessage("氏名・パスワードを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await api("POST", "/auth/signup", {
        name,
        password,
        role,
      });

      saveSession(data.token, data.user);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "新規登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-xl">

        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-4xl font-extrabold text-transparent">
            新規登録
          </h1>

          <p className="mt-3 text-slate-400">
            ISDLoveを始めましょう
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-slate-700/70 bg-slate-900/45 p-6"
        >
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
              placeholder="村田 斉彬"
              autoComplete="name"
              className="w-full rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              パスワード
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="パスワード"
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-slate-200">
              ユーザー属性
            </legend>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "B4", label: "B4" },
                { value: "M1", label: "M1" },
                { value: "M2", label: "M2" },
                { value: "FACULTY", label: "教員" },
              ].map((item) => (
                <label
                  key={item.value}
                  className={`cursor-pointer rounded-xl border px-4 py-4 text-center transition ${
                    role === item.value
                      ? "border-indigo-400 bg-indigo-500/20 text-white"
                      : "border-slate-600 bg-slate-950/30 text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={item.value}
                    checked={role === item.value}
                    onChange={() => setRole(item.value)}
                    className="hidden"
                  />

                  <span className="font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {errorMessage && (
            <p className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 px-4 py-3 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "登録中..." : "新規登録"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          すでにアカウントをお持ちの方は{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-300 underline"
          >
            ログインはこちら
          </Link>
        </p>

      </div>
    </div>
  );
}