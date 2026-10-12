import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const A = "00000000-0000-4000-8000-000000000001",
  B = "00000000-0000-4000-8000-000000000002";
test("database enforces private favorites, vote ownership, 15-character comments and public aggregate-only ratings", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth;
   create table auth.users(id uuid primary key, raw_user_meta_data jsonb);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid;$$;
   grant usage on schema auth to anon,authenticated;`);
    const sql = await readFile(
      new URL("../supabase/schema.sql", import.meta.url),
      "utf8",
    );
    await db.exec(sql);
    await db.exec(
      `insert into auth.users values('${A}','{"display_name":"Player A"}'),('${B}','{"display_name":"Player B"}');`,
    );
    await db.exec(sql); // Setup must be repeatable without erasing users.
    assert.equal(
      (await db.query("select count(*)::int as n from public.fighters")).rows[0]
        .n,
      41,
    );
    assert.equal(
      (await db.query("select count(*)::int as n from public.profiles")).rows[0]
        .n,
      2,
    );
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${A}',false);`,
    );
    await db.query(
      `insert into public.favorites(user_id,kind,target) values($1,'fighter','jin')`,
      [A],
    );
    await assert.rejects(
      db.query(
        `insert into public.favorites(user_id,kind,target) values($1,'fighter','jin')`,
        [B],
      ),
    );
    await db.query(`insert into public.evaluations values($1,'jin',1,5)`, [A]);
    await assert.rejects(
      db.query(
        `update public.evaluations set user_id=$1 where fighter_id='jin'`,
        [B],
      ),
    );
    for (const [vote, stars] of [
      [2, 5],
      [1, 6],
      [0, null],
    ])
      await assert.rejects(
        db.query(`insert into public.evaluations values($1,'reina',$2,$3)`, [
          A,
          vote,
          stars,
        ]),
      );
    await db.query(
      `insert into public.comments(user_id,fighter_id,content) values($1,'jin',$2)`,
      [A, "🥊".repeat(15)],
    );
    for (const content of ["🥊".repeat(16), "", "line\nbreak"])
      await assert.rejects(
        db.query(
          `insert into public.comments(user_id,fighter_id,content) values($1,'reina',$2)`,
          [A, content],
        ),
      );
    await db.exec(`select set_config('request.jwt.claim.sub','${B}',false);`);
    assert.equal(
      (await db.query(`select * from public.favorites`)).rows.length,
      0,
    );
    assert.equal(
      (await db.query(`select * from public.evaluations`)).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query(
          `delete from public.comments where user_id=$1 returning *`,
          [A],
        )
      ).rows.length,
      0,
    );
    await db.query(`insert into public.evaluations values($1,'jin',-1,3)`, [B]);
    await db.exec(
      `reset role; set role anon; select set_config('request.jwt.claim.sub','',false);`,
    );
    await assert.rejects(db.query("select * from public.favorites"));
    await assert.rejects(db.query("select * from public.evaluations"));
    const stats = (await db.query("select * from public.character_standings()"))
      .rows;
    assert.equal(stats.length, 1);
    assert.equal(Number(stats[0].likes), 1);
    assert.equal(Number(stats[0].dislikes), 1);
    assert.equal(Number(stats[0].average), 4);
    assert.equal(Number(stats[0].star_sum), 8);
    const comments = (
      await db.query(
        "select c.content,p.display_name from public.comments c join public.profiles p on p.id=c.user_id",
      )
    ).rows;
    assert.equal(comments[0].display_name, "Player A");
    assert.equal(comments[0].content, "🥊".repeat(15));
  } finally {
    await db.close();
  }
});
