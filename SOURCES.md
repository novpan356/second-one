# Sources and coverage

Retrieved on 2026-10-10. Snapshot dates indicate upstream repository revisions, **not** a TEKKEN patch number. Official live verification remains blocked by the environment egress policy.

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
