import roster from "../roster.js";
import { localizedName } from "../editorial.js";
import { characterStories } from "./characters.js";
import { supportingStories } from "./supporting.js";
import { relationships, relationLabels } from "./relations.js";
import { timeline } from "./timeline.js";
export { relationships, relationLabels, timeline };
export const stories = { ...characterStories, ...supportingStories };
export const storyName = (id, lang) =>
  stories[id]?.name?.[lang] ||
  (roster.find((f) => f.id === id)
    ? localizedName(
        roster.find((f) => f.id === id),
        lang,
      )
    : id);
export const connections = (id) =>
  relationships
    .filter((e) => e.a === id || e.b === id)
    .map((e) => ({
      ...e,
      id: e.a === id ? e.b : e.a,
      label: e.a === id ? e.ab : e.ba,
    }));
export const chaptersFor = (id) => timeline.filter((c) => c.cast.includes(id));
export function relationshipSources(edge) {
  return [
    ...new Map(
      edge.refs
        .flatMap((ref) =>
          ref === "game-context"
            ? [
                {
                  label:
                    "Earlier TEKKEN character backstories · editorial series context",
                  url: "https://tk8.tekken-official.jp/mode/story.php#history",
                },
              ]
            : ref === "game-history"
              ? [
                  {
                    label: "TEKKEN 8 · official series history",
                    url: "https://tk8.tekken-official.jp/mode/story.php#history",
                  },
                ]
              : ref === "game-main"
                ? [
                    {
                      label:
                        "TEKKEN 8 · The Dark Awakens ending (game narrative)",
                      url: "https://tk8.tekken-official.jp/sc/mode/story.php",
                    },
                  ]
                : stories[ref]?.sources || [],
        )
        .map((s) => [s.url, s]),
    ).values(),
  ];
}
