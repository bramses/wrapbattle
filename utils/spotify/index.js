import axios from 'axios'

const SPOTIFY_API_URL = 'https://api.spotify.com/v1'

const unprivilegedApi = axios.create({
  baseURL: SPOTIFY_API_URL,
})

// This will be the privledged API once we initialize it
// Pointing it to the unprivilegedApi will allow downstream methods to fail
// gracefully when the Auth Token has not yet been returned
let api = unprivilegedApi

const requestAuthToken = () => {
  const encodedCredentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64')

  return axios
    .post(
      'https://accounts.spotify.com/api/token?grant_type=client_credentials',
      undefined,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    .then((response) => {
      if (!response.data) {
        throw new Error(
          `Failed to recieve Spotify Auth Response`
        )
      }
      return response.data
    })
}

const refreshTheToken = (infinte = false) => (
  requestAuthToken()
    .then(({ token_type, access_token, expires_in }) => {
      // Reduce expiration by 1 minute for saftey
      const expirationInSeconds = expires_in - (1 * 60)

      api = axios.create({
        baseURL: SPOTIFY_API_URL,
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      })

      if (infinte) {
        setTimeout(refreshTheToken, 1000 * expirationInSeconds)
      }
    })
    .catch((err) => {
      console.error(err)
    })
)

const request = (config, isRetry = false) => (
  api
    .request(config)
    .catch((err) => {
      if (err.response) {
        const { status } = err.response
        if (status.toString() === '401') {
          // Attempt a retry after re-authing, but just once
          if (!isRetry) {
            return refreshTheToken().then(() => request(config, true))
          }
        }
      }
      throw err
    })
)

/* Main Module */

refreshTheToken(true) // infinitley refresh the token in the server thread

export default request
