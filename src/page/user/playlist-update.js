import React from 'react';
import { connect } from 'react-redux';
import api from "../../api/playlist.js"
import axios from 'axios';
import { 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Button
} from 'reactstrap'

class PlaylistUpdate extends React.Component {
    constructor() {
        super()
        this.state = { // Initially pass null values into state
            id: null,
            song_title: '',
            artist: '',
            link: '',
            //isLoaded: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {
        let params = new URLSearchParams(window.location.search)
        this.setState({id: params.get('id')})

        axios
            .get(this.props.api + 'song/' + params.get('id'))
            .then((response) => {
                this.setState({
                    //isLoaded: true,
                    song_title: response.data.song_title,
                    artist: response.data.artist,
                    link: response.data.link,
                })
            }).catch(error => {
                alert(error)
                console.log(error)
            })
    }

    handleChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name
    
        this.setState({
          [name]: value
        })
    }

    handleSubmit(event) {
        axios
            .put(this.props.api + 'song/' + this.state.id, {
                song_title: this.state.song_title,
                artist: this.state.artist,
                link: this.state.link,
            })
            .then(() => {
                // redirect back to manage playlist page
                this.props.history.push('/manage-playlist')
            }).catch(error => {
                alert(error)
                console.log(error)
            })

        event.preventDefault()
    }

    render() {
        return (
            <div className="container main">
                <h1>Edit Playlist</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Song Title</label>
                        <input 
                            className="form-control" 
                            id="song_title"
                            name="song_title"
                            value={this.state.song_title} 
                            onChange={this.handleChange} 
                            required />
                    </div>
                    <div className="form-group">
                        <label>Artist</label>
                        <input 
                            className="form-control" 
                            id="artist"
                            name="artist"
                            value={this.state.artist} 
                            onChange={this.handleChange} 
                            required />
                    </div>
                    <div className="form-group">
                        <label>Link</label>
                        <input 
                            className="form-control" 
                            id="link"
                            name="link"
                            value={this.state.link} 
                            onChange={this.handleChange} 
                            required />
                    </div>

                    <button type="submit" className="btn btn-primary">Update</button>
                    <button 
                        className="btn btn-danger"
                        onClick={() => this.props.history.push('/manage-playlist')}>
                            Cancel
                    </button>
                </form>
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
)(PlaylistUpdate);