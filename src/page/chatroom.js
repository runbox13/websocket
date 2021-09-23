import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import ReactPlayer from 'react-player'
//import { useSelector } from 'react-redux';
import {w3cwebsocket as W3CWebSocket} from 'websocket'; 
import {connect} from 'react-redux';

const socket = new W3CWebSocket('ws://127.0.0.1:8080');

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

function waitForSocketConnection(socket, callback){
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
            <button onClick={() => joinChatroom(props.user)}>{props.user}</button>
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


class Chatroom extends React.Component {
    
    componentDidMount() {
        socket.onopen = () => {
            console.log("WS connected");
        };
    }

    constructor() {
        super();
         this.state = {}
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
                    <SideBarChatbox user={this.props.user.id}/>
                </Col>
            </Row>
        </Container>
        </>
    );
};
}

const mapStateToProps = state => {
  return { 
      user: state.user
  }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom);