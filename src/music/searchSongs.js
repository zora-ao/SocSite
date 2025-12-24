export async function searchSongs(query) {
  if (!query) return [];

  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(
      query
    )}&entity=song&limit=10`
  );

  const data = await res.json();

  return data.results.map((song) => ({
    trackName: song.trackName,
    artistName: song.artistName,
    artworkUrl: song.artworkUrl100,
    previewUrl: song.previewUrl,
  }));
}
