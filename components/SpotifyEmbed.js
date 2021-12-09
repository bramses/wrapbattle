const SpotifyEmbed = ({ src }) => (
  <iframe
    src={src}
    width="300"
    height="80"
    frameBorder="0"
    allowtransparency="true"
    allow="encrypted-media"
  />
);

export default SpotifyEmbed;
