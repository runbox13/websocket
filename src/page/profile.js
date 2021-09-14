import React from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
    constructor() {
        super()
        this.state = { 
        }
    }

    render() {
        return (
            <div className="container main">
                <h1>Manage Profile</h1>
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
)(Profile);