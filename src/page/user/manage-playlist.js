import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios';

class ManagePlaylist extends React.Component {
    constructor() {
        super()
        this.state = { 
            playlist: {
                id: null,
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
                playlist.id = res.data.playlist.id
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
    handleDelete(index, id) {
        if (window.confirm("Are you sure you want to delete this song?")) { // Delete validation window
            axios
                .delete(this.props.api + 'track/' + id, {
                    headers: {
                        'Authorization': `Bearer ${this.props.user.api_key}`
                    }
                })
                .then(() => {
                    // delete track from local state and refresh component
                    let tracks = [...this.state.playlist.tracks]
                    tracks.splice(index, 1)

                    let updatedPlaylist = this.state.playlist
                    updatedPlaylist.tracks = tracks

                    this.setState({
                        playlist: updatedPlaylist
                    })
                })
        }
    }

    // Update handler for changing track details 
    handleEdit(id) {
        let path = '/manage-playlist/update?id=' + id // Temporary path
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
                                    onClick={() => this.handleDelete(i, track.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <button type="button" className="btn btn-primary" 
                    onClick={() => this.props.history.push('/manage-playlist/add?pid=' + this.state.playlist.id)}
                >
                    Add track
                </button>
            </div>
            
        )
    }
}

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