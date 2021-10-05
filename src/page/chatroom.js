import React from 'react';
import { Container, Row, Col, Card, Navbar, NavbarBrand, Button } from 'reactstrap';
import ReactPlayer from 'react-player'
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { connect } from 'react-redux';
import axios from 'axios';


const socket = new W3CWebSocket('ws://127.0.0.1:8080');

function SidebarPlaylist() {
    return (
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

    for (var key in props.users) {
        array.push(<li id={key}>{props.users[key].display_name}</li>);
    }

    return array;

}

function CenterChatroom() {
    return (
        <div className="centerChatroom">
            <div className="video-wrapper">
                <ReactPlayer url='' playing={true} controls={true} width={"100%"} height={"100%"} />
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
                if (callback != null) {
                    callback();
                }
            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }
        }, 5);
}

function joinChatroom(user, room) {
    waitForSocketConnection(socket, function () {
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
            }).catch(error => { console.log(error) });
    }

    componentWillUnmount() {
        socket.close();
    }

    constructor() {
        super();
        this.state = {
            users: {},
            room: {},
            queue: [],
            isQueued: false,
            dj: [],
            isDJ: false
        }

        socket.onclose = event => {

        };

        socket.onmessage = event => {
            console.log("received");

            var messageEvent = JSON.parse(event.data);
            var users;

            //Set the DJ state
            if (messageEvent.type == "setDj") {
                //Set DJ state from websocket data
                this.setState(prevState => { return { dj: messageEvent.payload } });
                //If this user is the DJ, set the booleans
                if (this.state.dj != null && this.state.dj.id === this.props.user.id) {
                    this.setState({ isDJ: true });
                    this.setState({ isQueued: false });
                } else {
                    this.setState({ isDJ: false });
                }

            }

            if (messageEvent.type === "getList") {
                users = messageEvent.payload;

                if (messageEvent.action == "ADD") {
                    this.setState(prevState => {
                        var newState = prevState;
                        newState.users = users;
                        return newState;
                    })
                }

                if (messageEvent.action == "DELETE") {
                    this.setState(prevState => {
                        var newState = prevState;
                        newState.users = users;
                        return newState;
                    })
                }
            }

            //Receive queue, update state
            if (messageEvent.type == "getQueue") {
                var queue = messageEvent.payload;
                this.setState(prevState => {
                    var newState = prevState;
                    newState.queue = queue;
                    return newState;
                });
                //If queue array contains a user with the same id, set boolean
                for (var key in this.state.queue) {
                    if (this.props.user.id == this.state.queue[key].id) this.setState({ isQueued: true });
                    else this.setState({ isQueued: false });
                }

                //If the queue array is empty, set boolean
                if (this.state.queue.length === 0) this.setState({ isQueued: false });
            }
        };
    }

    queueDj = () => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "queue",
            action: "ADD",
            user: this.props.user,
            roomId: this.state.room.id
        }));
    }

    deQueue = () => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "queue",
            action: "DELETE",
            user: this.props.user,
            roomId: this.state.room.id
        }));
    }


    jumpOffDj = () => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "jumpOff",
            roomId: this.state.room.id
        }));
    }

    render() {
        return (
            <>
                <Container fluid>
                    <Navbar>
                        <NavbarBrand>{this.state.room.name}</NavbarBrand>
                        {!this.state.isDJ ? <Button onClick={this.state.isQueued ? this.deQueue : this.queueDj}> {this.state.isQueued ? 'Dequeue' : 'Queue up for DJ'}</Button>
                            : <Button onClick={this.jumpOffDj}>Jump off</Button>}
                    </Navbar>
                    <Row>
                        <Col>
                            <SidebarPlaylist />
                        </Col>
                        <Col xs={8}>
                            <CenterChatroom />
                        </Col>
                        <Col>
                            <SideBarChatbox state={this.state} />
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