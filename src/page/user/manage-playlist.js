import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios';

class ManagePlaylist extends React.Component {
    constructor() {
        super()
        this.state = { 
            //isLoaded: false,
            playlist: {
                name: '',
                description: '',
                tracks: []
            }
        }
    }

    componentDidMount() {
        // Fetch playlist data and pass into empty state
        axios
            .get(this.props.api + 'playlist/created-by/' + this.props.user.id)
            .then((res) => {
                let playlist = {}
                playlist.name = res.data.playlist.name
                playlist.description = res.data.playlist.description

                playlist.tracks = []
                res.data.tracks.forEach(function(track) {
                    playlist.tracks.push(track)
                })
                
                this.setState({
                    playlist: playlist
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Delete handler for deleting a single track from the playlist
    handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this song?")) { // Delete validation window
            axios.delete(this.props.api + 'track/' + id) // Delete song by id
                .then((response) => {
                    console.log(response)
                    // reload the page/component here
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

                <h3>{this.state.playlist.name}</h3>
                <p>{this.state.playlist.description}</p>

                <div className="align-middle">
                <table className="table table-responsive mt-4" data-testid="playlist_table">
                    <thead>
                        <tr>
                            <th scope="col-auto">#</th>
                            <th scope="col-auto">Title </th>
                            <th scope="col-auto">Artist</th>
                            <th scope="col-auto">Link</th>
                            <th scope="col-auto"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.playlist.tracks.map((track, i) => ( // Using a map for outputting the playlist data
                        <tr className="align-middle" key={track.id}> 
                            <th scope="row">{ i + 1 }</th>
                            <td className="align-middle">{track.title}</td>
                            <td className="align-middle">{track.artist}</td>
                            <td className="align-middle"><a href={track.url} target="_blank" rel="noreferrer">{track.url}</a></td>
                            <td className="align-middle text-center">
                                <button type="button" className="btn btn-outline-secondary" 
                                    // Edit handler connected to button
                                    onClick={() => this.handleEdit(track.id)}>Edit</button> 
                                <button type="button" className="btn btn-danger" 
                                    // Delete handler connected to button
                                    onClick={() => this.handleDelete(track.id)}>Delete</button>
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