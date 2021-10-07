import axios from 'axios';
import React from 'react'
import { connect } from 'react-redux'
import { Card, Button, CardText, CardTitle, CardBody } from 'reactstrap';




function PlaceHolder(props) {
    
    var cards = [];

    for(var i = 0; i < props.rooms.length; ++i){
        cards.push(
            <Card style={{width: '18rem'}}>
                <CardBody>
                    <CardTitle>
                     {props.rooms[i].name}
                    </CardTitle>
                    <CardText>
                        {props.rooms[i].description}
                    </CardText>
                    <Button variant="primary" href={"http://localhost:3000/chatroom?id=" + props.rooms[i].id}>Go to Chatroom</Button>
                </CardBody>
            </Card>
            );
    }
    
    return(
        cards
    );
}

class Lobby extends React.Component {
    componentDidMount() {
        this.getRooms();
    }

    constructor() {
        super()
        this.state = {
            rooms: ''
        }
    }

    getRooms = () => {
        axios.get("http://localhost:8000/room")
        .then(data => {
            this.setState( {
                rooms: data.data
            })
            console.log(this.state[0]);
            console.log(this.state[0].name);
        }).catch(error => {
            console.log(error);
        });
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
                <PlaceHolder api={this.props.api} rooms={this.state.rooms}>

                </PlaceHolder>
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
//

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);