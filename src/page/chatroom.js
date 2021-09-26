import React from 'react';
import { Container, Row, Col, Card, Navbar, NavbarBrand, Button } from 'reactstrap';
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
            <UsersList users={props.state.users}></UsersList>
        </ul>
    </div>)
}

function UsersList(props) {

    var array = [];

    for(var key in props.users) {
        array.push(<li id={key}>{props.users[key].display_name}</li>);
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

function joinChatroom(user, room) {  
    room = JSON.stringify(room);

    waitForSocketConnection(socket, function() {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "join",
            user: user,
            room: room
        }));
    
        console.log("Request sent!");
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
            joinChatroom(this.props.user, this.state.room);
        }).catch(error => {console.log(error)});
    }

    componentWillUnmount() {
        socket.close();
    }

    constructor() {
        super();
         this.state = {
             users: {},
             room: {},
             queue: {}
         }

        socket.onclose = event => {
            
        };

        socket.onmessage = event => {
            var messageEvent = JSON.parse(event.data);
            var users;
            if(messageEvent.type === "getList") {
                users = messageEvent.payload;
                    
                if(messageEvent.action == "ADD") {
                    this.setState(prevState => {
                        var newState = prevState;
                        newState.users = users;
                        return newState;
                    })
                }
                
                if(messageEvent.action == "DELETE") {
                    this.setState(prevState => {
                        var newState = prevState;
                        newState.users = users;                 
                        return newState;
                    })
                }
            } 
            
            if(messageEvent.type === "getQueue") {
                var queueIds = messageEvent.payload;
                for(var key in queueIds) {
                    axios.get(this.props.api + "user/" + queueIds[key])
                    .then(payload => {
                        if(messageEvent.action == "ADD") {
                            this.setState(prevState => {
                                var newState = Object.assign(prevState);
                                newState.queue[payload.data.id] = payload.data;
                            });
                        }
                        if(messageEvent.action == "DELETE") {
                            this.setState(prevState => {
                                var newState = Object.assign(prevState);
                                delete newState.queue[payload.data.id];                 
                            })
                        }
                        
                    }).catch(error => {console.log(error)});
                }
            }
    };
  }

    queueDj = () => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "queue",
            payload: this.props.user.id
        }));
    }

  

    render() {
    return(
        <>
        <Container fluid>
            <Navbar>
                   <NavbarBrand>{this.state.room.name}</NavbarBrand>
                   <Button onClick={this.queueDj}>Queue up for DJ</Button>
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