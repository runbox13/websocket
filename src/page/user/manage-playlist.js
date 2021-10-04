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
                description: "Lorem ipsum dolor sit amet..",
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
                console.log(response.data)
                this.setState({
                    song_title: response.data.song_title,
                    artist: response.data.artist,
                    link: response.data.link,
                })
            })
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }

    handleDelete(id, index) {
        if (window.confirm("Are you sure you want to delete this song?")) {
            axios.delete(this.props.api + 'song/' + id)
                .then((response) => {
                    console.log(response)

                    // delete song from local state and refresh component
                    let playlist = [...this.state.playlist]
                    playlist.splice(index, 1)
                    this.setState({
                        playlist: playlist
                    })
                });
        }
    }

    handleEdit(songId) {
        //let path = '/manage-playlist/update?id=' + songId
        let path = '/manage-playlist/update'
        this.props.history.push(path)
    }

    render() {
        return (
            <div className="container main" >
                <h1 className="mb-4">Manage Playlist</h1>

                <h2>{this.state.playlist.title}</h2>
                <p>{this.state.playlist.description}</p>

                <div className="align-middle">
                <table className="table table-responsive">
                    <thead>
                        <tr>
                            <th scope="col-auto">#</th>
                            <th scope="col-auto">Song Title</th>
                            <th scope="col-auto">Artist</th>
                            <th scope="col-auto">Link</th>
                            <th scope="col-auto">Options</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    {this.state.playlist.tracks.map((track, i) => (
                        <tr className="align-middle" key={track.id}>
                            <th scope="row">{ i + 1 }</th>
                            <td className="align-middle">{track.song_title}</td>
                            <td className="align-middle">{track.artist}</td>
                            <td className="align-middle">{track.link}</td>
                            <td className="align-middle text-center">
                                <button type="button" className="btn btn-outline-secondary" 
                                    onClick={() => this.handleEdit(track.id)}>Edit</button>
                                <button type="button" className="btn btn-danger" 
                                    onClick={() => this.handleDelete(track.id, i)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => this.props.history.push('/manage-playlist/add')}>
                        Add song
                </button>
                <button type="button" className="btn btn-secondary">Edit playlist title</button>

            </div>
            
        )
    }
};

const mapStateToProps = state => {
    return { 
        api: state.api,
        user: state.user
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