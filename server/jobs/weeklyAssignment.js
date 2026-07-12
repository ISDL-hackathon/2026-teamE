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

  // 院生・先生を取得
  const { data: seniors, error: seniorError } = await supabase
    .from("users")
    .select("id")
    .in("role", ["M1", "M2", "FACULTY"]);

  if (seniorError) throw seniorError;

  // B4を取得
  const { data: b4s, error: b4Error } = await supabase
    .from("users")
    .select("id")
    .eq("role", "B4");

  if (b4Error) throw b4Error;

  // B4がいない場合
  if (!b4s || b4s.length === 0) {

    for (const senior of seniors) {
      await supabase
        .from("notifications")
        .insert({
          user_id: senior.id,
          type: "SYSTEM",
          message: "今週は対象者がいません。"
        });
    }

    return [];
  }

  // ランダム化
  const shuffled = [...b4s].sort(() => Math.random() - 0.5);

  const used = new Set();
  const results = [];

  for (const senior of seniors) {

    // 各B4の評価
    const candidateScores = await Promise.all(
      shuffled.map(async (b4) => ({
        b4,
        count: await pastPairCount(senior.id, b4.id),
        used: used.has(b4.id),
        random: Math.random()
      }))
    );

    // 優先順位
    candidateScores.sort((a, b) => {

      // ① 過去に組んだ回数
      if (a.count !== b.count) {
        return a.count - b.count;
      }

      // ② 今週まだ使われていない
      if (a.used !== b.used) {
        return a.used ? 1 : -1;
      }

      // ③ ランダム
      return a.random - b.random;
    });

    const pick = candidateScores[0].b4;

    used.add(pick.id);

    const { data, error } = await supabase
      .from("random_assignments")
      .upsert(
        {
          senior_id: senior.id,
          b4_id: pick.id,
          week_key
        },
        {
          onConflict: "senior_id,week_key"
        }
      )
      .select()
      .single();

    if (error) throw error;

    results.push(data);

    await supabase
      .from("notifications")
      .insert({
        user_id: senior.id,
        type: "RANDOM",
        message: "今週の話し相手が決まりました！"
      });
  }

  return results;
}

/**
 * 過去に senior と b4 が組んだ回数を数えるヘルパー
 * 入力: senior_id: string, b4_id: string
 * 出力: Promise<number>
 */
export async function pastPairCount(senior_id, b4_id) {
  // TODO: 実装する
    const { count, error } = await supabase
    .from("random_assignments")
    .select("*", { count: "exact", head: true })
    .eq("senior_id", senior_id)
    .eq("b4_id", b4_id);

  if (error) {
    throw error;
  }

  return count ?? 0;
}
