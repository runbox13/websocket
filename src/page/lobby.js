import React from 'react'
import { connect } from 'react-redux'

class Lobby extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
            <div className="container main">
                <h1>Lobby</h1>
                <p>
                    Hey there, <code
                        className="code-link"
                        onClick={() => this.props.history.push('/profile?id=' + this.props.user.id)}>
                            {this.props.user.display_name}
                    </code>
                </p>
            </div>
        );
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
)(Lobby);