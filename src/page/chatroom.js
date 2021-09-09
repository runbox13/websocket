import React from 'react';
import { Container, Row, Col } from 'reactstrap';


function SidebarPlaylist() {
    return(
        <div class="sideBarPlaylist">
            TestLeft
        </div>
    );
}

function SideBarChatbox() {
    return(
        <div class="sideBarChatbox">
            TestRight
        </div>
    );
}

function CenterChatroom() {
    return(
        <div class="centerChatroom">
            Test
        </div>
    );
}


class Chatroom extends React.Component {


    render() {
    return(
        <>
        <Container>
            <Row>
                <Col>
                    <SidebarPlaylist/>
                </Col>
                <Col>
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