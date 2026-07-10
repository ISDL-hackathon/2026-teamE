// ============================================================
// 担当: メンバー3（ランダムマッチング・通知）
// 責務: 週次ランダム割り当ての生成ロジック本体。
//        routes/random.js の generateAssignments から呼ばれる。
//        （将来的には cron / GitHub Actions から定期実行する）
// アルゴリズム方針:
//   1. seniors = M1/M2/FACULTY 全員、b4s = B4 全員を取得しシャッフル
//   2. 各 senior について候補B4を次の優先度でソートして先頭を採用:
//        (a) 過去に組んだ回数が少ない  (b) 今週まだ誰にも割り当てられていない
//        (c) ランダム
//   3. random_assignments にINSERT（(senior_id, week_key) ユニーク制約で冪等）
//   4. senior へ RANDOM 通知をINSERT
//   5. B4 が 0 人なら割り当てスキップ＋「今週は対象なし」SYSTEM 通知
// ============================================================
import { supabase } from "../lib/supabase.js";

/**
 * 週次割り当てを生成する
 * 入力: week_key: string（例 "2026-W28"）
 * 出力: Promise<Array<{ senior_id: string, b4_id: string, week_key: string }>>
 * 例外: DB エラー時は throw（呼び出し側で 500 にする）
 */
export async function runWeeklyAssignment(week_key) {
  // TODO: 実装する
  throw new Error("Not implemented");
}

/**
 * 過去に senior と b4 が組んだ回数を数えるヘルパー
 * 入力: senior_id: string, b4_id: string
 * 出力: Promise<number>
 */
export async function pastPairCount(senior_id, b4_id) {
  // TODO: 実装する
  throw new Error("Not implemented");
}
