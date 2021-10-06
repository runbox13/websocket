import React from 'react';
import { Container, Row, Col, Card, Navbar, NavbarBrand, Button } from 'reactstrap';
import ReactPlayer from 'react-player'
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { connect } from 'react-redux';
import axios from 'axios';
import '../App.css';


const socket = new W3CWebSocket('ws://127.0.0.1:8080');

function SidebarPlaylist(props) {
    var tracks = [];
    var listItems;

    if (props.dj != null) {
        if (props.dj.id === props.user.id) {
            tracks.push({
                id: "0",
                title: "get you the moon",
                artist: "Kina",
                url: "https://www.youtube.com/watch?v=WTsmIbNku5g"
            });

            tracks.push({
                id: "2",
                title: "when i met u",
                artist: "hateful",
                url: "https://www.youtube.com/watch?v=30JOhWFkLro"
            });
        }
    }

    var sendTrack = (track) => {
        props.parentCallback(track);
    }


    if (tracks != null) {
        listItems = tracks.map((t) => <li key={t.id} onClick={() => sendTrack(t)}> {t.artist}: {t.title}</li>);
    }

    return (
        <div className="sideBarPlaylist">
            <p>Playlists</p>
            <ul>
                {listItems}
            </ul>
        </div>
    );
}

function SideBarChatbox(props) {
    var array = [];

    for (var key in props.state.users) {
        array.push(<li key={key}>{props.state.users[key].display_name}</li>);
    }



    return (
        <div className="sideBarChatbox">
            <p>Chatbox</p>
            <ul id='usersList'>
                {array}
            </ul>
        </div>)
}

function CenterChatroom(props) {

    var isUserDj = null;

    if(props.dj !== null) {
        if(props.dj.id === props.user.id) isUserDj = true;
    }

    return (
        <div className="centerChatroom">
            <div className="video-wrapper">
                <ReactPlayer onProgress={progress => {setProgress(progress.playedSeconds)}} url={props.songPlaying != "" ? props.songPlaying.url : ""} playing={true} 
                controls={isUSerDj ? true : false} width={"100%"} height={"100%"} />
            </div>
            <h5>Current DJ - {props.dj != null ? props.dj.display_name : ""}</h5>
            <Card>
                <Card body> 
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
            isDJ: false,
            songPlaying: null
        }

        socket.onclose = event => {
        };

        socket.onmessage = event => {
            console.log("received");

            var messageEvent = JSON.parse(event.data);
            var users;

            //Set the DJ state
            if (messageEvent.type === "setDj") {
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

            if (messageEvent.type === "getRoom") {
                users = messageEvent.payload;

                if (messageEvent.action === "ADD") {
                    this.setState(prevState => {
                        var newState = prevState;
                        newState.users = users;
                        newState.dj = messageEvent.dj;
                        newState.queue = messageEvent.queue;
                        return newState;
                    })
                }

                if (messageEvent.action === "DELETE") {
                    this.setState(prevState => {
                        var newState = prevState;
                        newState.users = users;
                        newState.dj = messageEvent.dj;
                        newState.queue = messageEvent.queue;
                        return newState;
                    })
                }
            }

            //Receive queue, update state
            if (messageEvent.type === "getQueue") {
                var queue = messageEvent.payload;
                this.setState(prevState => {
                    var newState = prevState;
                    newState.queue = queue;
                    return newState;
                });
                //If queue array contains a user with the same id, set boolean
                for (var key in this.state.queue) {
                    if (this.props.user.id === this.state.queue[key].id) {
                        this.setState({ isQueued: true });
                        break;
                    }
                    else this.setState({ isQueued: false });
                }

                //If the queue array is empty, set boolean
                if (this.state.queue.length === 0) this.setState({ isQueued: false });
            }

            if (messageEvent.type === "setTrack") {
                this.setState({songPlaying: messageEvent.songPlaying});
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

    setTrackCallback = (track) => {
        console.log(track);
        socket.send(JSON.stringify({
            type: "message",
            messageType: "setTrack",
            songPlaying: track,
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
                            <SidebarPlaylist dj={this.state.dj} user={this.props.user} parentCallback={this.setTrackCallback}/>
                        </Col>
                        <Col xs={8}>
                            <CenterChatroom dj={this.state.dj} user={this.state.user} songPlaying={this.state.songPlaying != null ? this.state.songPlaying : ""}/>
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