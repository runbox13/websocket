import React from 'react'
import { connect } from 'react-redux'

class ManagePlaylist extends React.Component {
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
                <ol className="list-group list-group-numbered">
                    <li className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                        <div className="fw-bold">Every Summertime</div>
                        Niki
                        </div>
                        <button type="button" className="btn btn-danger">Delete</button>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                        <div className="fw-bold">What is love?</div>
                        Twice
                        </div>
                        <button type="button" className="btn btn-danger">Delete</button>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                        <div className="fw-bold">Act up</div>
                        Rich Brian
                        </div>
                        <button type="button" className="btn btn-danger">Delete</button>
                    </li>
                </ol>
                <br></br>
                <button type="button" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-secondary">Edit</button>
                <button type="button" className="btn btn-danger">Delete</button>
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