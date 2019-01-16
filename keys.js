console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    key: process.env.omdb_key
};

exports.BandsInTown = {
    key: process.env.BandsInTown_app_id
};

