// ============================================================
// 担当: メンバー2（個人マッチング）
// 責務: 個人マッチングのスワイプ画面（B4のトップページを兼ねる）。
// 実装内容:
//   - 初期表示:
//       await api("GET", "/matching/candidates") → 候補配列
//       await api("GET", "/matching/quota")      → { limit, used, remaining }
//   - 候補を1枚ずつ SwipeCard で表示
//       右スワイプ → api("POST", "/matching/likes", { to_user_id, action: "LIKE" })
//       左スワイプ → api("POST", "/matching/likes", { to_user_id, action: "HOLD" })
//   - レスポンスの likes_remaining で残数表示を更新
//   - matched: true が返ったら「マッチしました！」の演出を出す
//   - 429 が返ったら「今週のいいねは上限（3人）です」を表示しスワイプ無効化
// 使うもの: api (../lib/api.js), SwipeCard (../components/SwipeCard.jsx)
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api.js";
import SwipeCard from "../components/SwipeCard.jsx";
import { Bookmark, Heart } from "../components/Icons.jsx";

function moveCandidateToFront(candidates, priorityUserId) {
  if (!priorityUserId) return candidates;

  const index = candidates.findIndex(
    (candidate) => candidate.id === priorityUserId
  );

  if (index <= 0) return candidates;

  return [
    candidates[index],
    ...candidates.slice(0, index),
    ...candidates.slice(index + 1),
  ];
}

export default function SwipeScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const priorityUserId = searchParams.get("from");
  const [candidates, setCandidates] = useState([]);
  const [remaining, setRemaining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [quotaReached, setQuotaReached] = useState(false);
  const [matched, setMatched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [candidateData, quotaData] = await Promise.all([
          api("GET", "/matching/candidates"),
          api("GET", "/matching/quota"),
        ]);

        if (cancelled) return;

        setCandidates(
  moveCandidateToFront(
    candidateData.candidates ?? [],
    priorityUserId
  )
);
        setRemaining(quotaData.remaining);
        setQuotaReached(quotaData.remaining === 0);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.message || "候補の取得に失敗しました"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [priorityUserId]);

  async function handleAction(action) {
    const candidate = candidates[0];

    if (!candidate || isSending || quotaReached) return;

    setIsSending(true);
    setMatched(false);
    setErrorMessage("");

    try {
      const data = await api("POST", "/matching/likes", {
        to_user_id: candidate.id,
        action,
      });

      setCandidates((previous) =>
  action === "HOLD"
    ? [...previous.slice(1), candidate]
    : previous.slice(1)
);
      setRemaining(data.likes_remaining);
      setQuotaReached(data.likes_remaining === 0);

      if (data.matched) {
        setMatched(true);
      }
    } catch (error) {
      if (error.status === 429) {
        setQuotaReached(true);
        setRemaining(0);
        setErrorMessage("今週のいいねは上限（3人）です");
      } else {
        setErrorMessage(
  "いいね回数の上限です。土曜0時にリセットされます。"
);
      }
    } finally {
      setIsSending(false);
    }
  }

  const candidate = candidates[0];
  const actionDisabled = !candidate || isSending || quotaReached;

  return (
  <div className="relative flex min-h-[calc(100vh-4rem)] flex-col px-6 pb-48 pt-6">
    <header>
  <div className="flex items-start justify-between gap-4">
    <h1 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-2xl font-bold text-transparent">
  個人マッチング
</h1>

    <button
      type="button"
      onClick={() => navigate("/profile")}
      className="shrink-0 rounded-xl border border-slate-400 px-3 py-2 text-sm font-bold text-white"
    >
      プロフィールを編集
    </button>
  </div>

  <div
    className={`mt-4 flex items-center gap-3 ${
      candidate?.avatar_url ? "justify-between" : "justify-center"
    }`}
  >
    {candidate?.avatar_url && (
      <div className="min-w-0">
        <p className="truncate text-lg font-bold text-slate-300">
          {candidate.name}
        </p>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
          {candidate.role || "メンバー"}
        </p>
      </div>
    )}

    <div className="shrink-0 text-center">
      <p className="inline-block rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-sky-300">
        残りいいね回数：{remaining}回
      </p>
      <p className="mt-1 text-xs text-slate-400">
        （土曜0時にリセット）
      </p>
    </div>
  </div>
</header>

    <div className="mt-4 space-y-3">
      {matched && (
        <p className="rounded-xl bg-pink-500/20 px-4 py-3 text-center font-bold text-pink-200">
          マッチしました！
        </p>
      )}

      {errorMessage && (
        <p className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      )}
    </div>

    <main className="flex flex-1 items-center justify-center py-4">
      {loading ? (
        <p className="text-slate-300">候補を読み込んでいます...</p>
      ) : quotaReached ? (
        <p className="w-full max-w-sm rounded-xl border border-slate-600 p-4 text-slate-300">
          今週のいいねは上限です。来週また利用できます。
        </p>
      ) : isSending ? (
        <p className="text-slate-300">送信しています...</p>
      ) : candidate ? (
        <div className="w-full max-w-sm -translate-y-4">
          <SwipeCard
            user={candidate}
            onSwipeRight={() => handleAction("LIKE")}
            onSwipeLeft={() => handleAction("HOLD")}
          />
        </div>
      ) : (
        <p className="w-full max-w-sm rounded-xl border border-slate-600 p-4 text-slate-300">
          表示できる候補はいません。
        </p>
      )}
    </main>

    <div className="fixed bottom-36 left-1/2 z-20 flex w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 justify-center gap-10">
  <button
    type="button"
    onClick={() => handleAction("HOLD")}
    disabled={actionDisabled}
    aria-label="保留にする"
    className="flex flex-col items-center gap-2 text-sm font-bold text-slate-100 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-500 shadow-xl shadow-indigo-950/60">
  <Bookmark size={30} strokeWidth={2.2} aria-hidden="true" />
</span>
    <span>保留</span>
  </button>

  <button
    type="button"
    onClick={() => handleAction("LIKE")}
    disabled={actionDisabled}
    aria-label="いいねする"
    className="flex flex-col items-center gap-2 text-sm font-bold text-slate-100 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-500 shadow-xl shadow-rose-950/60">
  <Heart size={32} strokeWidth={2.2} aria-hidden="true" />
</span>
    <span>いいね！</span>
  </button>
</div>

    <button
      type="button"
      onClick={() => navigate("/chats")}
     className="fixed bottom-20 left-1/2 z-10 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 rounded-xl bg-gray-500 px-4 py-3 font-bold text-white shadow-lg"
    >
      チャット一覧へ
    </button>
  </div>
  );
}
