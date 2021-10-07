import React from 'react';
import { connect } from 'react-redux';
import './lobby.css';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card, Button, CardText, CardTitle, CardBody, CardSubtitle, CardImgOverlay, CardImg} from 'reactstrap';

function App() {
  const [rooms, setPost] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const api = useSelector(state => state.api);
  const user = useSelector(state => state.user);
  const history = useHistory()
  const dispatch = useDispatch();

  React.useEffect(() => {
    axios.get("http://localhost:8000/user").then((response) => {
      setUsers(response.data);
    });
    axios.get("http://localhost:8000/room").then((response) => {
      setPost(response.data);
    });
  }, []);

const pic = [
{id:1,
  img:'https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB6KAYW8BN9j5s-5nSSxs_g3DdfmA',
},
{id:2,
  img:'https://i.ytimg.com/vi/XULUBg_ZcAU/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAGXaDCsrgDpwuqwE0ioASYvF1OCA',
},
{id:3,
  img:'https://i.ytimg.com/vi/36YnV9STBqc/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBvMJHTmNfBKNe-cKpL_KjrhxXuvQ',
},
{id:4,
  img:'https://i.ytimg.com/vi/62d2QvWAVt4/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCgA-azV2AUnoCVrmd_stl_FHMqrQ',
},
{id:5,
  img:'https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB6KAYW8BN9j5s-5nSSxs_g3DdfmA',
},
{id:6,
  img:'https://i.ytimg.com/vi/2QXa9ib4dbA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDAoUNQOZ2ZXG_7TalFGbn7ItbSFQ',
},
{id:7,
  img:'https://i.ytimg.com/vi/kovfGjs7d0Q/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA8wMnXDaVF_SeheBVLCv3a6TbvBQ',
},
{id:8,
  img:'https://i.ytimg.com/vi/4zeUOUo09Hs/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCRzd6bunDkU_IS_IWKByYz-bxXyQ',
},
{id:9,
  img:'https://i.ytimg.com/vi/n3rzL9JLp8o/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA-lnn1rSCLf0kCuVzaOgd0UDchiA',
},
{id:10,
  img:'https://i.ytimg.com/vi/XULUBg_ZcAU/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAGXaDCsrgDpwuqwE0ioASYvF1OCA',
},
];  

function Chatroom(){
  return(
    <section className='flex-container'>
      {rooms.map((room) => {
        return <Room key={room.id} {...room}> </Room>;
      })}
    </section>
  )
}

const Room = (props) =>{
  const {id,name,description,user_id} = props;
  return(
    
      <Card  border="danger" style={{ width: '18rem' }}>
        <a href={"http://localhost:3000/chatroom?id=" + id} >
           <CardImg variant="top" src={pic[id].img} />
                </a>
                <CardBody>
                    <CardTitle> 
                     {name}
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted"><p>Created by, <a className="mb-2 text-muted" href={"http://localhost:3000/profile?id=" + id}>{users[user_id-1].display_name}</a></p></CardSubtitle>
                    <CardText>
                        {description}
                    </CardText>
                </CardBody>
    
        </Card>
      
  );
};

  return (
    <div className="container main">
                <h1>Lobby</h1>
                <p>
                    Hey there, <code
                        className="code-link"
                        onClick={() => history.push('/profile?id=' + user.id)}>
                            {user.display_name}
                    </code>
                </p>
                 <div>{Chatroom()}</div> 
            </div>
  );
}


export default connect()(App);
