import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

class PlaylistAdd extends React.Component {
    constructor() {
        super()
        this.state = { 
        }
    }

    render() {
        return (
            <div className="container main">
                <h1>Add to Playlist</h1>
                <form>
                    <div class="form-group">
                        <label>Song Title</label>
                        <input class="form-control" placeholder="Enter song title"/>
                    </div>
                    <div class="form-group">
                        <label>Artist</label>
                        <input class="form-control" placeholder="Enter artist"/>
                    </div>
                    <div class="form-group">
                        <label>Link</label>
                        <input class="form-control" placeholder="Enter link"/>
                    </div>
                    <button type="submit" class="btn btn-primary">Add</button>
                    <Link to ="/playlist">
                        <button type="submit" class="btn btn-danger">Cancel</button>
                    </Link>
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
)(PlaylistAdd);