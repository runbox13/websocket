import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

class PlaylistAdd extends React.Component {
    constructor() {
        super()
        this.state = { // Initially pass null values into state
            title: '',
            artist: '',
            url: '',
            playlist_id: null
        }

        this.handleChange = this.handleChange.bind(this) // Update handler
        this.handleSubmit = this.handleSubmit.bind(this) // Submit handler
    }

    componentDidMount() {
        // get playlist ID from the query string
        let params = new URLSearchParams(window.location.search)
        this.setState({playlist_id: params.get('pid')})
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
            .post(this.props.api + 'track/store', { // Posts the new track data to the playlist database
                title: this.state.title,
                artist: this.state.artist,
                url: this.state.url,
                playlist_id: this.state.playlist_id
            }, {
                headers: {
                    'Authorization': `Bearer ${this.props.user.api_key}`
                }
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

    render() {
        return (
            <div className="container main manage-playlist">

                <h1 className="mb-4">Add Track</h1>
                
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input 
                            className="form-control" 
                            id="title"
                            name="title"
                            value={this.state.title} 
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
                        <label>URL</label>
                        <input 
                            className="form-control" 
                            id="url"
                            name="url"
                            value={this.state.url} 
                            onChange={this.handleChange} 
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add</button>
                    <button className="btn btn-secondary" // On cancel return to manage playlist page
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