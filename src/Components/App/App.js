import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistName: "",
      playlistTracks: [],
      searchResults: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    const index = this.state.playlistTracks.findIndex(
      (pTrack) => pTrack.id === track.id
    );

    if (index === -1) {
      const newPlaylist = this.state.playlistTracks;
      newPlaylist.push(track);

      this.setState({
        playlistTracks: newPlaylist,
      });
    }
  }

  removeTrack(track) {
    const index = this.state.playlistTracks.findIndex(
      (pTrack) => pTrack.id === track.id
    );

    if (index !== -1) {
      const newPlaylist = this.state.playlistTracks.splice(index, 1);

      this.setState({
        playlistTracks: newPlaylist,
      });
    }
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then((tracks) => {
      this.setState({
        searchResults: tracks,
      });
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name,
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              onNameChange={this.updatePlaylistName}
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
