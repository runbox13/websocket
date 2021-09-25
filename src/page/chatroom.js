import React from 'react';
import { Container, Row, Col, Card, Navbar, NavbarBrand } from 'reactstrap';
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
    
        return (
        <div className="sideBarChatbox">
            <p>Chatbox</p>
        <ul>
            <UsersList usersInRoom={props.state.usersInRoom}></UsersList>
        </ul>
    </div>)
}

function UsersList(props) {

    var array = [];

    for(var key in props.usersInRoom) {
        array.push(<li id={key}>{props.usersInRoom[key].display_name}</li>);
    }
    
    return array;

}

function CenterChatroom() {
    return(
        <div className="centerChatroom">
            <div className="video-wrapper">
                <ReactPlayer  url='https://www.youtube.com/watch?v=_tV5LEBDs7w' playing={true} controls={true} width={"100%"} height={"100%"}/>
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

function joinChatroom(userId, room) {  
    room = JSON.stringify(room);

    waitForSocketConnection(socket, function() {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "join",
            userId: userId,
            room: room
        }));
    
        console.log("Message sent!");
    })
 }  


class Chatroom extends React.Component {
    
    componentDidMount() {
        socket.onopen = () => {
            console.log("WS connected");
        };

        var roomId = (window.location.href).split("?id=")[1];

        axios.get(this.props.api + "room/" + roomId)
        .then(payload => {
            this.setState(prevState => {
                var newState = Object.assign(prevState);
                newState.room = payload.data;
                return newState;
            })     
            joinChatroom(this.props.user.id, this.state.room);
        }).catch(error => {console.log(error)});
    }

    componentWillUnmount() {
        socket.close();
    }

    constructor() {
        super();
         this.state = {
             usersInRoom: {},
             room: ''
         }

        socket.onclose = event => {
            
        };

        socket.onmessage = event => {
            var messageEvent = JSON.parse(event.data);
            var usersByIdInRoom;
            console.log(messageEvent.payload);
            if(messageEvent.type === "getList") {
                usersByIdInRoom = messageEvent.payload;
                    
                    for(var key in usersByIdInRoom) {
                        axios.get(this.props.api + "user/" + usersByIdInRoom[key])
                        .then(payload => {
                            this.setState(prevState => {
                                var newState = Object.assign(prevState);
                                if(messageEvent.action == "ADD") {
                                    console.log(messageEvent.action);
                                    newState.usersInRoom[payload.data.id] = payload.data;
                                }
                                if(messageEvent.action == "DELETE") {
                                    console.log("DELETE");
                                    newState.usersInRoom[payload.data.id] = payload.data;
                                    delete newState.usersInRoom[messageEvent.userId];
                                }
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
            <Navbar>
                   <NavbarBrand>{this.state.room.name}</NavbarBrand>
            </Navbar>
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