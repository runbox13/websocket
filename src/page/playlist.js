import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

class Playlist extends React.Component {
    constructor() {
        super()
        this.state = { 
        }
    }

    render() {
        return (
            <div className="container main">
                <h1>Manage Playlist</h1>
                <br></br>
                <h2>Playlist: Sample</h2>
                <ol class="list-group list-group-numbered">
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                        <div class="fw-bold">Every Summertime</div>
                        Niki
                        </div>
                        <button type="button" class="btn btn-outline-secondary mr-1">Edit</button>
                        <button type="button" class="btn btn-danger">Delete</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                        <div class="fw-bold">What is love?</div>
                        Twice
                        </div>
                        <button type="button" class="btn btn-outline-secondary">Edit</button>
                        <button type="button" class="btn btn-danger">Delete</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                        <div class="fw-bold">Act up</div>
                        Rich Brian
                        </div>
                        <button type="button" class="btn btn-outline-secondary">Edit</button>
                        <button type="button" class="btn btn-danger">Delete</button>
                    </li>
                </ol>
                <br></br>
                <Link to ="/playlist-add">
                    <button type="button" class="btn btn-primary">Add song</button>
                </Link>
                <button type="button" class="btn btn-secondary">Edit playlist title</button>
                <button type="button" class="btn btn-danger">Delete playlist</button>
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
)(Playlist);