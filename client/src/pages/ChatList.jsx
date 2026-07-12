// ============================================================
// 担当: メンバー4（チャット）
// 責務: チャット一覧画面（マッチした相手のみ表示）。
// 実装内容:
//   - 表示時: await api("GET", "/matches")
//       → { matches: [{ id, partner: { name, role, avatar_url },
//                        matched_at, last_message? }] }
//   - 各行に相手の名前と最新メッセージを表示
//   - 行をタップ → navigate(`/chats/${match.id}`) でトークルームへ
//   - マッチが0件なら「まだマッチした相手がいません」を表示
// 使うもの: api (../lib/api.js), useNavigate
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ChatList() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      try {
        const data = await api("GET", "/matches");

        if (!cancelled) {
          setMatches(data.matches ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message || "チャット一覧の取得に失敗しました"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-primary">チャット</h1>

      {loading && <p className="text-slate-300">読み込んでいます...</p>}

      {errorMessage && (
        <p className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      )}

      {!loading && !errorMessage && matches.length === 0 && (
        <p className="text-slate-300">
          まだマッチした相手がいません
        </p>
      )}

      <div className="space-y-3">
        {matches.map((match) => (
          <button
            key={match.id}
            type="button"
            onClick={() => navigate(`/chats/${match.id}`)}
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left text-slate-800 shadow"
          >
            {match.partner?.avatar_url ? (
              <img
                src={match.partner.avatar_url}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-white">
                {match.partner?.name?.slice(0, 1) ?? "?"}
              </div>
            )}

            <div className="min-w-0">
              <p className="font-bold">
                {match.partner?.name ?? "不明なユーザー"}
              </p>
              <p className="text-sm text-slate-500">
                {match.last_message?.body ?? "まだメッセージはありません"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
