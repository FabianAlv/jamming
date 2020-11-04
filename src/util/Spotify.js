const clientId = "";
const redirectURI = "http://localhost:3000/";
let accessToken;

const Spotify = {
  getAccesToken: function () {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },

  savePlaylist: function (playlistName, trackURIs) {
    if (playlistName && trackURIs) {
      const token = Spotify.getAccesToken();
      const headers = { Authorization: `Bearer ${token}` };
      let userId;

      fetch("https://api.spotify.com/v1/me", { headers: headers })
        .then((response) => response.json())
        .then((jsonResponse) => {
          userId = jsonResponse.id;

          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ name: playlistName }),
          })
            .then((response) => response.json())
            .then((jsonResponse) => {
              const playlistId = jsonResponse.id;

              return fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                  headers: headers,
                  method: "POST",
                  body: JSON.stringify({ uris: trackURIs }),
                }
              );
            });
        });
    }
  },

  search: function (searchTerm) {
    const token = Spotify.getAccesToken();
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (jsonResponse.tracks) {
          console.log(jsonResponse.tracks.items[0].album);

          return jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.album.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          }));
        } else {
          return [];
        }
      });
  },
};

export default Spotify;
