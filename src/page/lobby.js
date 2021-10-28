import React from 'react';
import '../css/lobby.css';
import axios from 'axios';
import { /* useDispatch, */ connect, useSelector } from "react-redux";
import { Card, CardText, CardTitle, CardBody, CardSubtitle, CardImg } from 'reactstrap';
import { placeholder } from '../helper/placeholder'
import {Link} from "react-router-dom";



function Lobby() {
  const [rooms, setPost] = React.useState([]);
  const [users, setUsers] = React.useState();

  const api = useSelector(state => state.api);
  const user = useSelector(state => state.user);
  //const dispatch = useDispatch();

  React.useEffect(() => {
    
      axios.get(api+ "user").then((response) => {
        setUsers(response.data);

      axios.get(api + "room").then((response) => {
        setPost(response.data);
      }).catch(e => console.log(e));

    }).catch(e => console.log(e));
  }, [api]);

  function Chatroom() {
    return (
      <section className="flex-container" data-testid="cardHeader">
        {rooms.map((room) => {
          return <Room key={room.id} {...room}> </Room>;
        })}
      </section>
    )
  }

  const Room = (props) => {
    const { id, name, description, user_id } = props;

    return (

      <Card className="lobbycard">
        <a href={"/chatroom?id=" + id} >
          <CardImg variant="top" src={placeholder[Math.floor(Math.random() * placeholder.length)].img} />
        </a>
        <CardBody>
          <CardTitle>
            <b>{name}</b>
          </CardTitle>
          <CardSubtitle className="mb-2 text-muted"><p>Created by <a className="mb-2 user-link" href={"/profile?id=" + user_id}>{users.find(x => x.id === user_id).display_name}</a></p></CardSubtitle>
          <CardText>
            {description}
          </CardText>
        </CardBody>

      </Card>

    );
  };

  return (
    <div className="container main lobby">
      <h1>Lobby</h1>
      <p>
        Hey there, 
        <ul>
              <li><Link to={'/profile?id=' + user.id}>{user.display_name} </Link></li>
        </ul>

      </p>
      <div>{Chatroom()}</div>

    </div>
  );
}

export default connect()(Lobby);
