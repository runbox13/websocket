import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import ReactPlayer from 'react-player'
//import { useSelector } from 'react-redux';

function SidebarPlaylist() {
    return(
        <div className="sideBarPlaylist">
            <p>Playlists</p>
        </div>
    );
}

function SideBarChatbox() {
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
                <ReactPlayer  url='https://www.youtube.com/watch?v=dQw4w9WgXcQ' playing={true} controls={true} width={"100%"} height={"100%"}/>
           </div>
           <Card>
               <Card body>Rick Roll
               </Card>
           </Card>
        </div>
    );
}


class Chatroom extends React.Component {
    

    constructor() {
        super();
         this.state = {
            listeners: []
         };

         this.state.listeners.push("test2");
         console.log(this.state.listeners);
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
                    <SideBarChatbox/>
                </Col>
            </Row>
        </Container>
        </>
    );
};
}

export default Chatroom;