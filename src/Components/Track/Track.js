import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  renderAction() {
    let button;

    if (this.props.isRemoval) {
      button = (
        <button className="Track-action" onClick={this.removeTrack}>
          -
        </button>
      );
    } else {
      button = (
        <button className="Track-action" onClick={this.addTrack}>
          +
        </button>
      );
    }

    return button;
  }

  render() {
    const track = this.props.track;

    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{track.name}</h3>
          <p>
            {track.artist} | {track.album}
          </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
