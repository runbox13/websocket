import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios';

class ManagePlaylist extends React.Component {
    constructor() {
        super()
        this.state = { 
            //isLoaded: false,
            playlist: {
                title: "A sample playlist",
                description: "This is a collection of my favourite songs!",
                tracks: [
                    {
                        "id": 1,
                        "song_title": "What is Love?",
                        "artist": "Twice",
                        "link": "https://www.youtube.com/watch?v=i0p1bmr0EmE"
                    },
                    {
                        "id": 2,
                        "song_title": "Every Summertime",
                        "artist": "Niki",
                        "link": "https://www.youtube.com/watch?v=OXtZfPZIex4"
                    }
                ]
            }
        }
    }

    componentDidMount() {
        // Fetch playlist data and pass into empty state
        axios.get(this.props.api + 'playlist', {
        })
            .then((response) => {
                console.log(response.data) // Output response data in console
                this.setState({
                    // Loads state with all tracks in playlist
                    song_title: response.data.song_title, 
                    artist: response.data.artist,
                    link: response.data.link,
                })
            })
            // Catch and output errors in browser and console
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }

    // Delete handler for deleting a single track from the playlist
    handleDelete(id, index) {
        if (window.confirm("Are you sure you want to delete this song?")) { // Delete validation window
            axios.delete(this.props.api + 'song/' + id) // Delete song by id
                .then((response) => {
                    console.log(response)

                    // Delete song from local state and refresh component
                    let playlist = [...this.state.playlist]
                    playlist.splice(index, 1)
                    this.setState({
                        playlist: playlist
                    })
                });
        }
    }

    // Update handler for changing track details 
    handleEdit(songId) {
        //let path = '/manage-playlist/update?id=' + songId
        let path = '/manage-playlist/update?id=' + songId // Temporary path
        this.props.history.push(path) // React route for update page
    }

    render() {
        return (
            <div className="container main manage-playlist">
                <h1 className="mb-4" data-testid="mpHeader">Manage Playlist</h1>

                <h2>{this.state.playlist.title}</h2>
                <p>{this.state.playlist.description}</p>

                <div className="align-middle">
                <table className="table table-responsive" data-testid="playlist_table">
                    <thead>
                        <tr>
                            <th scope="col-auto">#</th>
                            <th scope="col-auto">Song Title </th>
                            <th scope="col-auto">Artist</th>
                            <th scope="col-auto">Link</th>
                            <th scope="col-auto">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.playlist.tracks.map((track, i) => ( // Using a map for outputting the playlist data
                        <tr className="align-middle" key={track.id}> 
                            <th scope="row">{ i + 1 }</th>
                            <td className="align-middle">{track.song_title}</td>
                            <td className="align-middle">{track.artist}</td>
                            <td className="align-middle">{track.link}</td>
                            <td className="align-middle text-center">
                                <button type="button" className="btn btn-outline-secondary" 
                                    // Edit handler connected to button
                                    onClick={() => this.handleEdit(track.id)}>Edit</button> 
                                <button type="button" className="btn btn-danger" 
                                    // Delete handler connected to button
                                    onClick={() => this.handleDelete(track.id, i)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <button type="button" className="btn btn-primary" 
                    // Add song route 
                    onClick={() => this.props.history.push('/manage-playlist/add')}> Add song </button>
                {/* <button type="button" className="btn btn-secondary">Edit playlist title</button>
                <button type="button" className="btn btn-secondary">Edit description</button> */}

            </div>
            
        )
    }
};

const mapStateToProps = state => {
    return { 
        api: state.api,
        user: state.user // Load user into state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManagePlaylist);