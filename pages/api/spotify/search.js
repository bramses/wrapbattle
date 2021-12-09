import spotifyRequest from '../../../utils/spotify';

export default async function handler(req, res) {
  try {
    const { query } = req.body;

    const response = await spotifyRequest({
      method: 'get',
      url: '/search',
      params: {
        type: 'track',
        q: query,
        limit: 5,
        market: 'US',
      },
    });

    const results = response.data
    const trackData = results.tracks.items.map(item => ({
      id: item.id,
      name: item.name,
      artist: item.artists.map(artist => artist.name).join(', '),
    }));

    // res.status(200).json(results.tracks.items);
    res.status(200).json(trackData);
  } catch (e) {
    console.log(e)
    res.status(500).end();
  }
}
