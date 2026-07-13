// ============================================================
// 担当: メンバー3（ランダムマッチング・通知）
// 責務: ランダムマッチング結果画面。今週話しかけるB4の名前を表示する。
// 実装内容:
//   - 表示時: await api("GET", "/random/current")
//       → { b4: { id, name, bio, avatar_url }, week_key, status }
//   - b4.name を大きく表示（bio やアバターも出すと良い）
//   - status が "ASSIGNED" のとき「話しました」ボタンを表示
//       → api("POST", "/random/current/done") → 表示を DONE に切り替え
//   - 404 のとき「今週の割り当てはまだありません」を表示
// 使うもの: api (../lib/api.js)
// ============================================================

import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function RandomResult() {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    loadAssignment();
  }, []);

  async function loadAssignment() {
    try {
      const data = await api("GET", "/random/current");
      setAssignment(data);
    } catch (err) {
      if (err.status === 404) {
        setNotFound(true);
      } else if (err.status === 403) {
        setForbidden(true); // または専用メッセージを表示
      } else {
        console.error(err);
      }
    }
    finally {
      setLoading(false);
    }
  }



  async function markDone() {
    try {
      await api("POST", "/random/current/done");

      setAssignment({
        ...assignment,
        status: "DONE",
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        読み込み中...
      </div>
    );
  }

  if (notFound) {
    return (
          <div className="min-h-[calc(100dvh-4rem)] px-6 py-10">
      <div className="mx-auto max-w-3xl">

        <h1 className="mb-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-center text-5xl font-extrabold text-transparent">
          今週の相手
        </h1>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-10 text-center shadow-xl">
          <div className="mb-6 text-6xl">🎲</div>

          <p className="text-2xl font-bold text-white">
            今週の相手はまだいません
          </p>

          <p className="mt-4 text-slate-400">
            ランダムマッチングが実行されるまでお待ちください。
          </p>
        </div>

      </div>
    </div>
    );
  }
  if (forbidden) {
    return (
      <div className="p-6 text-center">
        この機能はB4ユーザーは利用できません。
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-6 py-10">
  <div className="mx-auto max-w-3xl">

    <h1 className="mb-10 bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-center text-5xl font-extrabold text-transparent">
      今週の相手
    </h1>

    <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-10 text-center shadow-xl">

      {assignment.b4.avatar_url && (
        <img
          src={assignment.b4.avatar_url}
          alt={assignment.b4.name}
          className="mx-auto mb-6 h-36 w-36 rounded-full border-4 border-indigo-400 object-cover"
        />
      )}

      <h2 className="mb-4 text-4xl font-bold text-white">
        {assignment.b4.name}
      </h2>

      <p className="mb-8 text-slate-300">
        {assignment.b4.bio}
      </p>

      {assignment.status === "ASSIGNED" ? (
        <button
          onClick={markDone}
          className="rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 px-10 py-4 text-xl font-bold text-white"
        >
          話しました
        </button>
      ) : (
        <p className="text-2xl font-bold text-green-400">
          話しました ✓
        </p>
      )}

    </div>

  </div>
</div>
  );
}
