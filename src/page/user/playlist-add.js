import React from 'react';
import { connect } from 'react-redux';
//import api from "../../api/playlist.js"
import axios from 'axios';

class PlaylistAdd extends React.Component {
    constructor() {
        super()
        this.state = { // Initially pass null values into state
            song_title: '',
            artist: '',
            link: ''
        }

        this.handleAdd = this.handleAdd.bind(this); // Add handler for testing
        this.handleChange = this.handleChange.bind(this) // Update handler
        this.handleSubmit = this.handleSubmit.bind(this) // Submit handler

    }

    handleChange(event) { // Handles data handling in JSX for altered fields
        const target = event.target
        const value = target.value
        const name = target.name
    
        this.setState({
          [name]: value
        })
    }

    handleSubmit(event) {
        axios
            .post(this.props.api + 'playlist/store', { // Posts the new track data to the playlist database
                song_title: this.state.song_title,
                artist: this.state.artist,
                link: this.state.link,
            })
            .then((response) => { // Updates state with the new track
                console.log(response.data)
                // Redirect back to manage playlist
                this.props.history.push('/manage-playlist')

            // Catch and output errors in browser and console
            }).catch(error => { 
                alert(error)
                console.log(error)
            })
        event.preventDefault()
    }

    // Testing add function with local mock database
    handleAdd(event) {
        axios.put('http://localhost:5000/playlist', {
            song_title: this.state.song_title,
            artist: this.state.artist,
            link: this.state.link,
        })
            .then(() => {
                this.props.history.push('/manage-playlist')
            }).catch(error => {
                alert(error)
                console.log(error)
            })
        event.preventDefault();
    }

    render() {
        return (
            <div className="container main">
                <h1>Add Song</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Song Title</label>
                        <input 
                            className="form-control" 
                            placeholder="Enter song title"
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
                            placeholder="Enter artist"
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
                            placeholder="Enter link"
                            id="link"
                            name="link"
                            value={this.state.link} 
                            onChange={this.handleChange} 
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button className="btn btn-danger" // On cancel return to manage playlist page
                        onClick={() => this.props.history.push('/manage-playlist')}> Cancel 
                    </button>
                </form>
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
)(PlaylistAdd);