import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import ReactPlayer from 'react-player'

function SidebarPlaylist() {
    return(
        <div class="sideBarPlaylist">
            <p>Playlists</p>
        </div>
    );
}

function SideBarChatbox() {
    return(
        <div class="sideBarChatbox">
            <p>Chat</p>
        </div>
    );
}

function CenterChatroom() {
    return(
        <div class="centerChatroom">
            <div class="video-wrapper">
                <ReactPlayer  url='https://www.youtube.com/watch?v=dQw4w9WgXcQ' playing={true} controls={true} width={"100%"} height={"100%"}/>
           </div>
           <Card>
               <Card body>Rick Roll</Card>
           </Card>
        </div>
    );
}


class Chatroom extends React.Component {

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