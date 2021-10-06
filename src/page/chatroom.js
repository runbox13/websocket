import React, { useState } from 'react';
import { Container, Row, Col, Card, Navbar, NavbarBrand, Button, CardTitle, ListGroup, ListGroupItem, CardBody } from 'reactstrap';
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
        listItems = tracks.map((t) => <ListGroupItem key={t.id} onClick={() => sendTrack(t)}> {t.artist}: {t.title}</ListGroupItem>);
    }

    return (
        <Card className="sideBarPlaylist">
            <CardTitle className="text-center">Playlist</CardTitle>
            <ListGroup>
                {listItems}
            </ListGroup>
        </Card>
    );
}

function SideBarChatbox(props) {
    var array = [];

    for (var key in props.state.users) {
        array.push(<li key={key}>{props.state.users[key].display_name}</li>);
    }



    return (
        <Card className="sideBarChatbox">
            <CardTitle>Chatroom</CardTitle>
            <ul id='usersList'>
                {array}
            </ul>
        </Card>)
}

function CenterChatroom(props) {
    var [time, setTime] = useState(0);
    var songURL;

    if (props.songPlaying != null) {
        songURL = props.songPlaying.url + "&t=" + time;
    }

    var updateTime = (progress) => {
        if (progress.playedSeconds < props.time - 3 || progress.playedSeconds > props.time + 3) {
            console.log(progress.playedSeconds + " " + time);
            setTime(props.time);
        }
    }

    var getTime = (progress) => {
        if (props.isDj) {
            props.getTimeCallback(parseInt(progress.playedSeconds));
        } else
            updateTime(progress);
    }

    var djPause = () => {
        props.djPauseCallback();
        console.log("callback");
    }

    var djPlay = () => {
        props.djPlayCallback();
    }

    var nextSong = () => {
        props.nextSongCallback();
    }


    return (
        <div className="centerChatroom">
            <h5>Current DJ - {props.dj != null ? props.dj.display_name : ""}</h5>
            {props.isDj && props.songPlaying != "" ? <Button onClick={nextSong}>Next Song</Button> : ""}

            {!props.isDj && !props.isQueued? <Button onClick={props.queueCallback}>Queue Up for DJ</Button> : ""}
            {!props.isDj && props.isQueued? <Button onClick={props.deQueueCallback}>Dequeue</Button> : ""}
            {props.isDj ? <Button onClick={props.jumpOffDjCallback}>Jump Off DJ</Button> : ""}

            <div className="video-wrapper">
                <ReactPlayer onEnded={nextSong} onProgress={progress => { getTime(progress) }} url={props.songPlaying != "" ? songURL : ""} playing={!props.isPaused}
                    controls="true" width={"100%"} height={"100%"} onPause={props.isDj ? djPause : ""} onPlay={props.isDj ? djPlay : ""} />
            </div>
            <Card>
                <CardTitle>{props.songPlaying.artist} - {props.songPlaying.title}</CardTitle>
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
            dj: null,
            isDj: false,
            songQueue: [],
            isPaused: false,
            time: 0
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
                    this.setState({ isDj: true });
                    this.setState({ isQueued: false });
                } else {
                    this.setState({ isDj: false });
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

            if (messageEvent.type === "getSongQueue") {
                this.setState({ songQueue: messageEvent.songQueue });
            }

            if (messageEvent.type === "djPause") {
                this.setState({ isPaused: messageEvent.isPaused });
            }

            if (messageEvent.type === "djPlay") {
                this.setState({ isPaused: messageEvent.isPaused });
            }

            if (messageEvent.type === "getTime") {
                this.setState({ time: messageEvent.time })
            }

            if (messageEvent.type === "nextSong") {
                this.setState({ songQueue: messageEvent.songQueue })
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
            track: track,
            roomId: this.state.room.id
        }));
    }

    djPauseCallback = () => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "djPause",
            roomId: this.state.room.id
        }));
    };

    djPlayCallback = () => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "djPlay",
            roomId: this.state.room.id
        }));
    }

    getTimeCallback = (time) => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "getTime",
            roomId: this.state.room.id,
            time: time
        }));
    }

    nextSongCallback = () => {
        socket.send(JSON.stringify({
            type: "message",
            messageType: "nextSong",
            roomId: this.state.room.id,
        }));
    }

    render() {
        return (
            <>
                <Container fluid>
                    <Navbar>
                        <NavbarBrand>{this.state.room.name}</NavbarBrand>
                    </Navbar>
                    <Row>
                        <Col>
                            <SidebarPlaylist dj={this.state.dj} user={this.props.user} parentCallback={this.setTrackCallback} />
                        </Col>
                        <Col xs={8}>
                            <CenterChatroom deQueueCallback={this.deQueue} queueCallback={this.queueDj} jumpOffDjCallback={this.jumpOffDj} isQueued={this.state.isQueued} songQueue={this.state.songQueue} nextSongCallback={this.nextSongCallback}
                             isDj={this.state.isDj} time={this.state.time} getTimeCallback={this.getTimeCallback} djPlayCallback={this.djPlayCallback} djPauseCallback={this.djPauseCallback}
                                isPaused={this.state.isPaused} dj={this.state.dj} user={this.props.user}
                                songPlaying={this.state.songQueue.length != 0 ? this.state.songQueue[0] : ""} />
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