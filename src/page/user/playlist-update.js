import React from 'react';
import { connect } from 'react-redux';
//import api from "../../api/playlist.js"
import axios from 'axios';

class PlaylistUpdate extends React.Component {
    constructor() {
        super()
        this.state = { // Initially pass null values into state
            id: null,
            song_title: 'What is Love?',
            artist: 'Twice',
            link: 'https://www.youtube.com/watch?v=i0p1bmr0EmE',
            //isLoaded: false
        }

        this.handleChange = this.handleChange.bind(this) // Update handler
        this.handleSubmit = this.handleSubmit.bind(this) // Submit handler

    }

    componentDidMount() {
        let params = new URLSearchParams(window.location.search)
        this.setState({id: params.get('id')}) // Loads state in with the chosen track's ID

        axios
            .get(this.props.api + 'song/' + params.get('id')) // Search database for track with the chosen ID
            .then((response) => {
                this.setState({ // Populate state with chosen track data
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
            .put(this.props.api + 'song/' + this.state.id, { // Overwrites current database row for track with new data
                song_title: this.state.song_title,
                artist: this.state.artist,
                link: this.state.link,
            })
            .then(() => {
                // Redirect back to manage playlist page
                this.props.history.push('/manage-playlist')

            // Catch and output errors in browser and console
            }).catch(error => {
                alert(error)
                console.log(error)
            })

        event.preventDefault()
    }

    render() {
        return (
            <div className="container main manage-playlist">
                <h1 className="mb-4">Edit Song</h1>
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
                    <button className="btn btn-danger" // Redirects back to manage playlist on press
                        onClick={() => this.props.history.push('/manage-playlist')}> Cancel </button>
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
)(PlaylistUpdate);