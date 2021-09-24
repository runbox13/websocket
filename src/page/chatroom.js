import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import ReactPlayer from 'react-player'
import {w3cwebsocket as W3CWebSocket} from 'websocket'; 
import {connect} from 'react-redux';
import axios from 'axios';

const socket = new W3CWebSocket('ws://127.0.0.1:8080');

function SidebarPlaylist() {
    return(
        <div className="sideBarPlaylist">
            <p>Playlists</p>
        </div>
    );
}

function SideBarChatbox(props) {
    
        return (<div className="sideBarChatbox">
            <ul>
        <UsersList usersInRoom={props.state.usersInRoom}></UsersList>
        </ul>
    </div>)
}

function UsersList(props) {

    var array = [];

    for(var key in props.usersInRoom) {
        array.push(<li>{props.usersInRoom[key].display_name}</li>);
    }
    
    return array;

}

function CenterChatroom() {
    return(
        <div className="centerChatroom">
            <div className="video-wrapper">
                <ReactPlayer  url='' playing={true} controls={true} width={"100%"} height={"100%"}/>
           </div>
           <Card>
               <Card body> Rick Roll
               </Card>
           </Card>
        </div>
    );
}


function waitForSocketConnection(socket, callback) {
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if (callback != null){
                    callback();
                }
            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }
        }, 5);
}

function joinChatroom(userId) {  
    waitForSocketConnection(socket, function() {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "join",
            userId: userId,
        }));
    
        console.log("Message sent!");
    })
 }  


class Chatroom extends React.Component {
    
    componentDidMount() {
        socket.onopen = () => {
            console.log("WS connected");
        };

        joinChatroom(this.props.user.id);
        
    }

    constructor() {
        super();
         this.state = {
             usersInRoom: {}
         }

         socket.onmessage = event => {
            var messageEvent = JSON.parse(event.data);
            var usersByIdInRoom;
            if(messageEvent.type === "getList") {
                usersByIdInRoom = messageEvent.payload;
                    
                    for(var key in usersByIdInRoom) {
                        axios.get(this.props.api + "user/" + usersByIdInRoom[key])
                        .then(payload => {
                            this.setState(prevState => {
                                var newState = Object.assign(prevState);
                                newState.usersInRoom[payload.data.id] = payload.data;
                                return newState;
                            })
                        }).catch(error => {console.log(error)});
                    }                
            }
        };

    }

    render() {
    return(
        <>
        <Container fluid>
            <Row>
                <Col>
                    <SidebarPlaylist/>
                </Col>
                <Col xs={8}>
                    <CenterChatroom/>
                </Col>
                <Col>
                    <SideBarChatbox state={this.state}/>
                </Col>
            </Row>
        </Container>
        </>
    );
};
}

const mapStateToProps = state => {
  return { 
      user: state.user,
      api: state.api
  }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom);