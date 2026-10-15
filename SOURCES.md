# Sources and coverage

Retrieved on 2026-10-10. Snapshot dates indicate upstream repository revisions, **not** a TEKKEN patch number. Official Japanese and Chinese sites were reachable during the 2026-10-10 story research; direct Wavu reads remain blocked. Verification below is scoped to the specified pages, not all live game data.

## Official references to verify

- Chinese official site: https://tk8.tekken-official.jp/sc/
- Japanese official site: https://tk8.tekken-official.jp/
- Bandai Namco game page: https://www.bandainamcoent.com/games/tekken-8
- Fighter profiles: https://tekken.com/fighters/
- Official news: https://tk8.tekken-official.jp/sc/news/

The initial 2024-01-26 release and 32 launch characters are historical background. All new S3 releases, balance changes, shop listings and latest game patch must be independently checked before being presented as official facts.

## Movelist facts and combo notation

Community snapshot: https://github.com/tekken8movelist/tekken8movelist.github.io

Pinned revision: `47c6072898104ab7b6c54b6c11bbca8d1c0cb257` (2026-07-27 local upstream date).

The upstream README identifies Wavu Wiki as the movelist source. Each imported JSON retains the per-character original Wavu URL. These are **indirect community mirrors**, not direct official data. The interface shows this provenance and does not claim accuracy for the latest game patch.

- 36 character datasets contain structured move facts, frames and original English notes from `tools/source/<character>.json`. Combo input routes are taken from the corresponding `_combos.json`, with an obvious unfinished placeholder removed.
- Jun, Xiaoyu, Law, Clive and Kunimitsu use limited English static-page move entries plus the command/startup facts in `tools/wavu_<character>.txt`. Equivalent spacing and `d/f` versus `df` notation variants are deduplicated. Missing hit/block/counter values are not inferred or copied from an incompatible older snapshot.
- For these five, routes in the static pages' Starter / Route combo tables are retained after removing graphical input markup; section labels are preserved where structured data is available.
- Country, style and epithet come from the upstream `official_profiles.json`, whose fetching script names tekken.com as its source. This is still an indirectly obtained snapshot.
- Upstream Chinese move-name interpretations, generated avatar illustrations, application code and UI layouts are not copied. Our UI/editorial translations and app code are original. Original factual move names and commentary remain in their source language.

Rights in source commentary remain with their respective contributors; source attribution is retained. Original application code does not relicense third-party content. Upstream mirror licensing and Wavu's current content terms need checking before distribution beyond this development project.

## Images

TEKKEN character and promotional art rights remain with Bandai Namco and, where relevant, other original rights holders. Images are saved locally for the requested reference interface, with source mirrors recorded here; original official URLs have **not** been verified. The images are converted to WebP for delivery, without presenting them as newly authored or generated artwork.

1. https://github.com/aliiakbarkhan/Tekken-VIII-Website
   - Revision `191559f1091c588f0a94368ff036d7969debb099`, 2025-03-15.
   - 25 character portraits from `assets/character icons/`.
   - `assets/fights/1346634.jpeg` for the hero and `1350542.png` for the lab banner.
2. https://github.com/MoonGoon72/Tekken8-Frame-Data
   - Revision `808e575f12ea8e63916cc4eb3c1249b93c5ed090`, 2026-10-04.
   - 16 additional portraits from `Tekken8 Frame Data/TK8/Assets.xcassets/Characters/`.
   - Anna, Armor King, Asuka, Azucena, Clive, Eddy, Fahkumram, Heihachi, Kunimitsu, Lidia, Lili, Miary Zo, Nina, Panda, Xiaoyu, Zafina.

## Players

Profiles are original editorial descriptions of established historical character use. Outbound Liquipedia fighter-profile links are reference destinations, not proof of current roster, main character, sponsorship or ranking. Some associations originate in earlier TEKKEN titles. Characters without known associations show an explicit pending-data state. All 41 character pages provide this section, but not all have a verified associated pro player.

## Coverage totals

41 fighter entries, 7,343 move records and 2,373 combo routes. Counts are snapshot entries and may include stance variants and partial string extensions. They do not imply a complete official move list or current-patch verification. The latest roster may have changed after the source snapshot. 36 datasets are structured frame snapshots and 5 are partial. 28 player profiles are supplied; live player verification is outstanding.

## Move-specific sidestep counterplay (2026-10-10 redesign)

`src/movement.js` reads **explicit** defender escape and tracking statements from the attributed move notes. It distinguishes escape directions from tracked directions; a move tracking left does **not** establish that it can be escaped right. Self sidesteps, stance cancels and sidestep startup costs are not defender counterplay. Unspecified and tentative source statements remain marked, including distance and blocked-hit conditions. No training-mode testing or current-patch verification was performed.

The current 7,343 records yield 400 documented assessments: 339 both-side tracking records, 51 directional tracking records and 10 explicit escape records, across 36 character datasets. These are records, not unique guaranteed matchups. The remaining 6,943 entries show unknown directions and remain searchable; missing evidence is not inferred.

Additional research: [joshleichty/tekken8-guides](https://github.com/joshleichty/tekken8-guides), pinned `979b0c5a20b9ba80e14d960b9fddb23a205e5c17` (2026-03-07), `data/applay-sheets/*.csv`. Its downloader identifies [Applay's Tekken 8 Library](https://docs.google.com/spreadsheets/d/e/2PACX-1vTsgbCJNSTKajMNlJvQleJOl0eTiEcV-PbeU0obDg1lsSqmz0lTtcD2k6NzfTPt7Db9Ua2dz1o_34Sv/pubhtml) as its source. We consulted the mirrored sheets; the current live spreadsheet was not verified. Only small factual command/counterplay excerpts are retained in `src/movement-research.json`, with a pinned per-sheet citation. No upstream app code, layout or full guide text was imported.

These sheets explicitly record SSL before Leo `b+1,4`'s second hit for Anna, Asuka, Azucena, Bryan, Claudio, Devil Jin, Dragunov, Heihachi, Hwoarang, King, Law, Lee and Steve. The interface lists and links those defender-specific sources, and does not generalize to other characters. Source patch is unspecified. Historical 2026-03 records are presented with their own date, separately from the 2026-07 move snapshot.

Wavu direct reads still returned HTTP 403 during this research. The official Chinese home page was reachable, but this redesign does not claim to have updated the official patch timeline or confirmed every current S3 release.

## Story archive and relationship dossiers (2026-10-10)

All 41 roster entries have original Chinese, English and Japanese multi-paragraph biographies, informed by directly retrieved Japanese official character pages: `https://tk8.tekken-official.jp/character/index.php?chara=<id>`. Each dossier carries its exact URL and retrieval date. This includes the newly published Kunimitsu background; availability of a biography is not evidence of an in-game release date. Original official prose and scraped HTML are not committed.

The seven historical chapters summarize the official history section at https://tk8.tekken-official.jp/mode/story.php#history. The Japanese and Chinese story-mode pages establish the TEKKEN 8 premise and distinguish The Dark Awakens from Character Episode hypothetical endings: https://tk8.tekken-official.jp/sc/mode/story.php.

The six TEKKEN 8 main-story chapters and Unforgotten Echoes chapter are original game-narrative summaries. The official web pages are background references, not a transcript verifying every ending or scene. This session did not perform a game playthrough. The standard Jin ending and alternate Kazuya ending are distinguished; the relationship tree marks Reina's revelation as a spoiler. Character Episode endings are explained as hypothetical and are not all individually catalogued. Clive's FINAL FANTASY XVI context is separated from TEKKEN canon.

There are 69 total dossiers (41 roster fighters plus 28 related people, creatures or organizations) and 86 bidirectional edges with distinct labels for each direction. Supporting biographies are editorial summaries of published background and established game context, with explicit limits on unknown details. Edges referring to broader series context, such as Armor King–Marduk and Yoshimitsu–Bryan, are visibly identified as series/game narrative instead of verified official webpage statements. No parentage is inferred from a surname: Reina's mother is not asserted, Asuka–Jun's precise kinship is left unspecified, and Miary Zo's deity is not identified as Ogre. Every relationship exposes its references.

Files: `src/lore/characters.js`, `supporting.js`, `relations.js`, `timeline.js` and `index.js`. `tests/lore.test.mjs` checks multilingual coverage, valid relationship endpoints, source references, chapter cast and sensitive relationship directions; `tests/lore-ui.mjs` exercises tree reading, rerooting, search, deep links, languages and mobile layouts.

## Reina portrait correction and crew masthead (2026-10-10)

The previous `reina.webp` was visually identified as Zafina and removed. The replacement is the unmodified official Reina character-selector PNG, retrieved directly from https://tk8.tekken-official.jp/images/character/reina/btn.png and cross-checked against the Reina page https://tk8.tekken-official.jp/character/index.php?chara=reina and its official full-body render. It is saved as `public/art/reina-official.png`; a shared artwork resolver updates the roster, profile, story avatars and banner consistently. Its new filename avoids browsers reusing the incorrect cached asset.

The SYM CREW masthead is an original CSS composition of all 41 existing site-roster portraits, including DLC and the community S3 entry, under a low-opacity red wash. It is a full-roster portrait montage, not a newly discovered official group photograph or confirmation that all snapshot entries have been released. Artwork attribution for the other portraits remains as listed above.

## Online player integration research (2026-10-12)

Consulted https://github.com/ewgf-gg/ewgfgg-frontend at revision `6aed2920a01f162ea79ba24c4ba904e244a17c8f` (archived README; repository declares continued closed-source development after 2025-10-16). Its factual endpoint paths and field names inform an original, optional adapter; no upstream application code, layout or data corpus is copied. Current requests to `ewgf.gg`, `www.ewgf.gg`, their search endpoint and `wank.wavu.wiki` were denied by the environment proxy (CONNECT 403). CORS, iframe availability, live player data and current API stability are therefore unverified. The application uses explicit external links until an authorized API is configured, never fabricated scores.

Community standings are original site-user evaluations, not EWGF ladder positions or game win rates. Missing cloud configuration disables sign-in submission and public mutations; local favorites remain available. Supabase's SDK handles authentication and the supplied SQL enforces ownership and limits server-side. Database permission checks execute in PGlite, an embedded PostgreSQL engine; browser auth/data fixtures do not establish a deployed Supabase service. Cloud deployment remains dependent on user project configuration as documented in `COMMUNITY_SETUP.md`.

## Guest comments and ordering (2026-10-12)

Guest interactions require no account form. With Supabase configured and Anonymous Sign-Ins enabled, the first mutation creates or reuses a server-issued anonymous session. Ownership policies remain enabled; unauthenticated raw `anon` clients do not gain write privileges. A composite foreign key binds comment reactions to an actual author/fighter comment, and one voter has one mutable reaction per comment. Public summaries expose aggregate counts rather than voter records. Ordering is likes descending, dislikes ascending, updated time descending, then author ID for deterministic ties.

Without a cloud connection, browser-local guest comments, reactions and evaluations persist in localStorage and are explicitly labeled local-only. They are not public shared data. Guest browser storage can be cleared, creating a new identity. The existing SQL can be rerun without removing prior comments; it appends `comment_reactions`, `comment_summaries` and `top_character_comments()`. Database checks and two-visitor browser fixtures verify ownership, count changes and top-comment selection, not an already deployed live cloud.

## Move search and outcome decoding (2026-10-15)

The existing 7,343 source records are unchanged. Search now normalizes common Tekken direction spellings (`d/f`, `df`, arrows), full-width punctuation, optional direction/button `+`, and LP/RP/LK/RK. It preserves button chords (`1+2`), strings (`1,2`) and just-frame `#`. Exact inputs and names rank ahead of prefixes, source-note matches, multiple keywords and one-edit English-name matches. A small original alias list supports familiar electric/hellsweep/hopkick terms; this is not a complete Chinese/Japanese translation of all move names. Supported property keywords use the existing documented fields, not generated move facts.

Outcome captions decode explicit opponent frame suffixes `a` (airborne), `c` (crouching), `d` (down), and `g` (guardable recovery). Plain frame numbers do not establish standing posture. Missing counter-hit entries are not presented as independently verified outcomes. Explicit `Forces crouch ...` notes are scoped to hit, block or CH. Attacker recovery (`FC`, `BT`) is separate from the defender; transient `cs` states are not treated as final recovery posture.

Ground orientations come only from explicit opponent-outcome clauses or `... knockdown on hit/CH`, not a move's input, its attacker recovery, or a Heat Dash alternative. FU/FD describe face up/down; FT/FA mean feet toward/away from the attacker (therefore head away/toward); FL/FR retain the source's left/right foot orientation. They do not establish that the body is lying on its side. Question marks remain tentative and combined alternatives remain combined. Unrecorded orientation, axis, distances and conditional launch exceptions are not inferred. Conditional source notes remain available in each move's original breakdown.

The pinned mirror's [notation knowledge note](https://github.com/tekken8movelist/tekken8movelist.github.io/blob/47c6072898104ab7b6c54b6c11bbca8d1c0cb257/tools/KNOWLEDGE.md) explicitly records FUFT versus FUFA direction semantics. Direct `https://wavu.wiki/t/Notation` returned HTTP 403 during this change; no current-patch or training-mode verification is claimed. This update improves discovery and interpretation of the existing snapshot, not its patch coverage.
