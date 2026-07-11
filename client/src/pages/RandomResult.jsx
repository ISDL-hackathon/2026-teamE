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
      } else {
        console.error(err);
      }
    } finally {
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
      <div className="p-6 text-center">
        今週の割り当てはまだありません。
      </div>
    );
  }

  return (
    <div className="p-6 text-center">

      <h1 className="text-2xl font-bold text-primary mb-8">
        今週の相手
      </h1>

      {assignment.b4.avatar_url && (
        <img
          src={assignment.b4.avatar_url}
          alt={assignment.b4.name}
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
      )}

      <h2 className="text-3xl font-bold mb-2">
        {assignment.b4.name}
      </h2>

      <p className="mb-6">
        {assignment.b4.bio}
      </p>

      {assignment.status === "ASSIGNED" ? (
        <button
          onClick={markDone}
          className="bg-primary text-white px-6 py-3 rounded-lg"
        >
          話しました
        </button>
      ) : (
        <p className="text-green-600 font-bold">
          話しました ✓
        </p>
      )}

    </div>
  );
}
