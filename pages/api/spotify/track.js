import spotifyRequest from '../../../utils/spotify';

export default async function handler(req, res) {
  try {
    const { id } = req.body;

    const response = await spotifyRequest({
      method: 'get',
      url: `/tracks/${id}`,
      params: {
        market: 'US',
      },
    });

    const result = response.data
    res.status(200).json(result);
  } catch (e) {
    console.log(e)
    res.status(500).end();
  }
}
