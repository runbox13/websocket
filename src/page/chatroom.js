import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, CardTitle, ListGroup, ListGroupItem, Popover, PopoverHeader, PopoverBody, InputGroup, InputGroupAddon } from 'reactstrap';
import ReactPlayer from 'react-player'
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { connect } from 'react-redux';
import axios from 'axios';
import '../css/chatroom.css';


const socket = new W3CWebSocket('ws://127.0.0.1:8080');

function SidebarPlaylist(props) {
    var tracks = [];
    var listItems;
    var songQueue = [];


    if (props.dj != null) {
        if (props.dj.id === props.user.id && props.user.id < 15) {
            tracks.push({
                id: "0",
                title: "get you the moon",
                artist: "Kina",
                url: "https://www.youtube.com/watch?v=WTsmIbNku5g"
            });

            tracks.push({
                id: "1",
                title: "when i met u",
                artist: "hateful",
                url: "https://www.youtube.com/watch?v=30JOhWFkLro"
            });
            tracks.push({
                id: "2",
                title: "3.A.M Study Session",
                artist: "Lofi Girl",
                url: "https://www.youtube.com/watch?v=BTYAsjAVa3I"
            });
            tracks.push({
                id: "3",
                title: "Chill Drive",
                artist: "chilli music",
                url: "https://www.youtube.com/watch?v=EIm4HvDgQCM"
            });
            tracks.push({
                id: "4",
                title: "Last breeze of the evening ",
                artist: "Dreamy",
                url: "https://www.youtube.com/watch?v=UMhOGEo8O5A"
            });
            tracks.push({
                id: "5",
                title: "The answer is in the stars ~ lofi mix",
                artist: "Dreamy",
                url: "https://www.youtube.com/watch?v=_DwmKtbVFJ4"
            });
            tracks.push({
                id: "6",
                title: "Why'd You Only Call Me When You're High?",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=6366dxFf-Os"
            });
            tracks.push({
                id: "7",
                title: "Knee Socks",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=oTP5bXzfh1c"
            });
            tracks.push({
                id: "8",
                title: "Mardy Bum",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=dO368WjwyFs"
            });
        }

        if (props.dj.id === props.user.id && props.user.id > 15) {
            tracks.push({
                id: "0",
                title: "Do i wanna know",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=bpOSxM0rNPM"
            });

            tracks.push({
                id: "1",
                title: "505",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=qU9mHegkTc4"
            });
            tracks.push({
                id: "2",
                title: "Why'd You Only Call Me When You're High?",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=6366dxFf-Os"
            });
            tracks.push({
                id: "3",
                title: "Knee Socks",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=oTP5bXzfh1c"
            });
            tracks.push({
                id: "4",
                title: "Mardy Bum",
                artist: "Arctic Monkeys",
                url: "https://www.youtube.com/watch?v=dO368WjwyFs"
            });
            tracks.push({
                id: "5",
                title: "Chill Drive",
                artist: "chilli music",
                url: "https://www.youtube.com/watch?v=EIm4HvDgQCM"
            });
            tracks.push({
                id: "6",
                title: "Last breeze of the evening ",
                artist: "Dreamy",
                url: "https://www.youtube.com/watch?v=UMhOGEo8O5A"
            });
            tracks.push({
                id: "7",
                title: "The answer is in the stars ~ lofi mix",
                artist: "Dreamy",
                url: "https://www.youtube.com/watch?v=_DwmKtbVFJ4"
            });
        }
    }

    var sendTrack = (track) => {
        props.parentCallback(track);
    }

    if (tracks != null) {
        listItems = tracks.map((t) => <ListGroupItem action className="rounded-0" key={t.id} onClick={() => sendTrack(t)}> {t.artist}: {t.title}</ListGroupItem>);
    }

    if (props.songQueue.length > 1) {
        var tempQueue = [...props.songQueue];
        if (props.songPlaying.queueId === tempQueue[0].queueId) {
            tempQueue.splice(0, 1);
        }
        songQueue = tempQueue.map((t) => <ListGroupItem className="rounded-0" key={t.queueId}> {t.artist}: {t.title}</ListGroupItem>);

    } else songQueue = [];

    return (
        <>
            <div id="leftSideBar" className="sideBarCards">
                <div className="sideBarTitle">Playlist</div>
                <ListGroup>
                    {listItems}
                </ListGroup>
            </div>
            <div id="queueSideBar" className="sideBarCards">
                <div className="sideBarTitle">Queue</div>
                <ListGroup>
                    {songQueue}
                </ListGroup>
            </div>
        </>
    );
}

function ChatboxPopover(props) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const togglePopover = () => { setPopoverOpen(!popoverOpen) };

    return (
        <div>
            <Button id="popOverButton">View Users in Room</Button>
            <Popover placement="left" isOpen={popoverOpen} target="popOverButton" toggle={togglePopover}>
                <PopoverHeader>Users in Room</PopoverHeader>
                <PopoverBody>
                    <ListGroup className="rounded-0" id="usersList">
                        {props.usersInRoom}
                    </ListGroup>
                </PopoverBody>
            </Popover>
        </div>
    );
}

function SideBarChatbox(props) {
    var usersInRoom = [];
    var chatLog = [];

    useEffect(() => {
        document.getElementById("messageContainer").scrollTop = document.getElementById("messageContainer").scrollHeight;
    })
    
    if(props.chatLog.length !== 0) {
        chatLog = props.chatLog.map(t => 
             <><a className="chatUsername" to="route" target="_blank" rel="noreferrer" href={"profile?id=" + props.user.id}>{t.user.display_name}: </a><span className="chatMessage">{t.message}</span><br/></> 
        )
    }

    const send = () => {
        var textInput = document.getElementById("textInput");
        socket.send(JSON.stringify({
            type: "message",
            messageType: "chatMessage",
            roomId: props.state.room.id,
            user: props.user,
            message: textInput.value
        }));
        console.log(textInput.value);
        textInput.value = "";

    }
    const sendMessage = (event) => {
        if(event.type === "keypress") {
            if(event.key === "Enter") {
                event.preventDefault();
                send();
            }
        } else send();
    }

    for (var key in props.state.users) {
        usersInRoom.push(<ListGroupItem className="rounded-0" key={key}><a rel="noreferrer" target="_blank" href={"profile?id=" + props.state.users[key].id}>{props.state.users[key].display_name}</a></ListGroupItem>);
    }

    return (
        <div id="rightSideBar" className="sideBarCards">
            <div className="sideBarTitle">
                Chatbox
            </div>
            <ChatboxPopover usersInRoom={usersInRoom} />
            <div id="chatbox">
                <div id="messageContainer">
                {chatLog}
                </div>
            </div>
            <InputGroup>
                <textarea placeholder="Send a message" id="textInput" onKeyPress={(key) => sendMessage(key)}/>
                <InputGroupAddon addonType="append">
                    <Button id="sendButton" onClick={(event) => sendMessage(event)}>Send</Button>
                </InputGroupAddon>
            </InputGroup>
        </div>)
}

function CenterChatroom(props) {
    var [time, setTime] = useState(0);
    var songURL;
    var [djTime, setDjTime] = useState(0);

    if (props.songPlaying != null) {
        if (!props.isDj) songURL = props.songPlaying.url + "&t=" + time;
        else songURL = props.songPlaying.url + "&t=" + djTime;
    }

    var updateTime = (progress) => {
        if (!props.isDj) {
            if (progress.playedSeconds < props.time - 3 || progress.playedSeconds > props.time + 3) {
                console.log(progress.playedSeconds + " " + time);
                setTime(props.time);
            }
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
        if (djTime === 0) setDjTime("");
        else setDjTime(0);
        setTimeout(props.nextSongCallback());
    }


    return (
        <div className="centerChatroom">

            <div className="video-wrapper">
                <ReactPlayer onEnded={nextSong} onProgress={progress => { getTime(progress) }} url={props.songPlaying !== "" ? songURL : ""} playing={!props.isPaused}
                    controls={true} width={"100%"} height={"100%"} onPause={props.isDj ? djPause : null} onPlay={props.isDj ? djPlay : null} />
            </div>

            {props.songPlaying !== "" ? <Card id="songCard"><CardTitle id="songTitle"><h5 id="songHeader">{props.songPlaying.artist + " - " + props.songPlaying.title}</h5></CardTitle>
                {props.isDj ? <Button id="nextSongButton" onClick={nextSong}>Next Song</Button> : ""}
            </Card> : ""}
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
            time: 0,
            chatLog: []
        }

        socket.onclose = () => {
        };

        socket.onmessage = event => {
            console.log("received");

            var messageEvent = JSON.parse(event.data);
            var users;

            //Set the DJ state
            if (messageEvent.type === "setDj") {
                //Set DJ state from websocket data
                this.setState(() => { return { dj: messageEvent.payload } });
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
                        newState.songQueue = messageEvent.songQueue;
                        newState.chatLog = messageEvent.chatLog;
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

            //Chatbox
            if(messageEvent.type === "getChatLog") {
                this.setState({chatLog: messageEvent.chatLog})
                console.log(this.state.chatLog);
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
                <Container fluid className="mainContainer">
                    <div id="topBar">
                        <div id="topBarTitle"><h5 id="topBarHeader">{this.state.room.name}{this.state.dj ? " | DJ: " + this.state.dj.display_name : ""}</h5></div>
                        {!this.state.isDj && !this.state.isQueued ? <Button className="topBarButton" onClick={this.queueDj}>Queue Up for DJ</Button> : ""}
                        {!this.state.isDj && this.state.isQueued ? <Button className="topBarButton" onClick={this.deQueue}>Dequeue</Button> : ""}
                        {this.state.isDj ? <Button className="topBarButton" onClick={this.jumpOffDj}>Jump Off DJ</Button> : ""}
                    </div>
                    <Row>
                        <Col id="leftColumn" className="column" xs="auto">
                            <SidebarPlaylist songPlaying={this.state.songQueue[0]} songQueue={this.state.songQueue} dj={this.state.dj} user={this.props.user} parentCallback={this.setTrackCallback} />
                        </Col>
                        <Col id="midColumn" className="column " xs="auto">
                            <CenterChatroom deQueueCallback={this.deQueue} queueCallback={this.queueDj} jumpOffDjCallback={this.jumpOffDj} isQueued={this.state.isQueued} songQueue={this.state.songQueue} nextSongCallback={this.nextSongCallback}
                                isDj={this.state.isDj} time={this.state.time} getTimeCallback={this.getTimeCallback} djPlayCallback={this.djPlayCallback} djPauseCallback={this.djPauseCallback}
                                isPaused={this.state.isPaused} dj={this.state.dj} user={this.props.user}
                                songPlaying={this.state.songQueue.length !== 0 ? this.state.songQueue[0] : ""} />
                        </Col>
                        <Col id="rightColumn" className="column " xs="auto">
                            <SideBarChatbox chatLog={this.state.chatLog} user={this.props.user} state={this.state} />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
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