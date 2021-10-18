import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class PlaylistUpdate extends React.Component {
    constructor() {
        super()
        this.state = { // Initially pass null values into state
            id: null,
            title: '',
            artist: '',
            url: ''
        }

        this.handleChange = this.handleChange.bind(this) // Update handler
        this.handleSubmit = this.handleSubmit.bind(this) // Submit handler
    }

    componentDidMount() {
        let params = new URLSearchParams(window.location.search)
        this.setState({id: params.get('id')}) // Loads state in with the chosen track's ID

        axios
            .get(this.props.api + 'track/' + params.get('id')) // Search database for track with the chosen ID
            .then((response) => {
                this.setState({ // Populate state with chosen track data
                    //isLoaded: true,
                    title: response.data.title,
                    artist: response.data.artist,
                    url: response.data.url
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
            .put(this.props.api + 'track/' + this.state.id, {
                title: this.state.title,
                artist: this.state.artist,
                url: this.state.url
            }, {
                headers: {
                    'Authorization': `Bearer ${this.props.user.api_key}`
                }
            })
            .then(() => {
                // redirect back to manage rooms page
                this.props.history.push('/manage-playlist')
            }).catch(error => {
                alert(error)
                console.log(error)
            })

        event.preventDefault()
    }

    render() {
        return (
            <div className="container main manage-playlist">

                <h1 className="mb-4">Edit Track</h1>
                
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

                    <button type="submit" className="btn btn-primary">Update</button>
                    <button className="btn btn-secondary" // Redirects back to manage playlist on press
                        onClick={() => this.props.history.push('/manage-playlist')}>Cancel</button>
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