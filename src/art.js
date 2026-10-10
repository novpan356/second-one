// Official replacement uses a new filename so cached incorrect portraits expire immediately.
export const fighterArtPath = (id) =>
  `${import.meta.env.BASE_URL}art/${id === "reina" ? "reina-official.png" : `${id}.webp`}`;
