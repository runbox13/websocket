import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import ReactPlayer from 'react-player'
import {w3cwebsocket as W3CWebSocket} from 'websocket'; 
import {connect} from 'react-redux';
import axios from 'axios';
import { useState } from 'react';

const socket = new W3CWebSocket('ws://127.0.0.1:8080');

function SidebarPlaylist() {
    return(
        <div className="sideBarPlaylist">
            <p>Playlists</p>
        </div>
    );
}

function SideBarChatbox(props) {

    return(
        <div className="sideBarChatbox">
            <p>Chat</p>
        </div>
    );
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

 function getUsers(usersByIdInRoom, api) {
    var usersInRoom = {}

    for(var key in usersByIdInRoom) {
        axios.get(api + "user/" + usersByIdInRoom[key])
        .then(payload => {
            usersInRoom[payload.data.id] =  payload.data;
        }).catch(error => {console.log(error)});
     }

     return usersInRoom;
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
             usersInRoom: {dog: {display_name: "dog"}}
         }

         socket.onmessage = event => {
            var messageEvent = JSON.parse(event.data);
            var usersByIdInRoom;
            if(messageEvent.type === "getList") {
                
                usersByIdInRoom = messageEvent.payload;
                var users = getUsers(usersByIdInRoom, this.props.api);
                
                //Set the state of usersInRoom to the object of users in the room sent by the socket
                this.setState(previousState => {
                    var newState = Object.assign(previousState);
                    newState.usersInRoom = users;
                    return newState;
                });
            } else {
                return;
            }
        };
    }
    

    render() {
    return(
        <>
        <Container fluid>
            <Row>
                <Col>
                    <SidebarPlaylist />
                </Col>
                <Col xs={8}>
                    <CenterChatroom/>
                </Col>
                <Col>
                    <SideBarChatbox/>
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