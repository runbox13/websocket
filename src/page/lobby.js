import React from 'react';
import { connect } from 'react-redux';
import './lobby.css';
import axios from 'axios';

class Lobby extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
            <div className="container main">
                <h1>Lobby</h1>
                <p>
                    Hey there, <code
                        className="code-link"
                        onClick={() => this.props.history.push('/profile?id=' + this.props.user.id)}>
                            {this.props.user.display_name}
                        
                    </code>
                </p>
                
                <div>{Chatroom()}</div>
            </div>
        );
    }
}

const rooms = [
  {id:1,
  img:'https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB6KAYW8BN9j5s-5nSSxs_g3DdfmA',
  title:'lofi hip hop radio - beats to relax/study to',
  views:'2000',
},
{id:2,
  img:'https://i.ytimg.com/vi/XULUBg_ZcAU/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAGXaDCsrgDpwuqwE0ioASYvF1OCA',
  title:'Calm Piano Music 24/7: study music, focus, think, meditation, relaxing music',
  views:'1235',
},
{id:3,
  img:'https://i.ytimg.com/vi/36YnV9STBqc/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBvMJHTmNfBKNe-cKpL_KjrhxXuvQ',
  title:'The Good Life Radio • 24/7 Live Radio | Best Relax House, Chillout, Study, Running, Gym, Happy Music',
  views:'1234',
},
{id:4,
  img:'https://i.ytimg.com/vi/62d2QvWAVt4/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCgA-azV2AUnoCVrmd_stl_FHMqrQ',
  title:'Music to put you in a better mood ~ A playlist lofi for study, relax, stress relief',
  views:'1234',
},
{id:5,
  img:'https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB6KAYW8BN9j5s-5nSSxs_g3DdfmA',
  title:'lofi hip hop radio - beats to relax/study to',
  views:'2000',
},
{id:6,
  img:'https://i.ytimg.com/vi/XULUBg_ZcAU/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAGXaDCsrgDpwuqwE0ioASYvF1OCA',
  title:'Calm Piano Music 24/7: study music, focus, think, meditation, relaxing music',
  views:'1235',
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
  const {id,img,title,views} = props;

  return(
    <article className='chatroom'>
      <a className = "limit" href={"http://localhost:3000/" + "chatroom?id=" + id}><img src={img} alt="chatroom"/><span className="text" title={title}>{title}</span>
</a>
      <h4>{views} listeners</h4>
    </article>
  );
};




const mapStateToProps = state => {
    return { 
        api: state.api,
        user: state.user
    }
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);