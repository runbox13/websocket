import logo from './logo.svg';
import './App.css';
import * as React from "react";
import { render } from "react-dom";
import c from "classnames";

const rooms = [
  {
  img:'https://i.ytimg.com/vi/5qap5aO4i9A/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB6KAYW8BN9j5s-5nSSxs_g3DdfmA',
  title:'lofi hip hop radio - beats to relax/study to',
  views:'2000',
},
{
  img:'https://i.ytimg.com/vi/XULUBg_ZcAU/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAGXaDCsrgDpwuqwE0ioASYvF1OCA',
  title:'Calm Piano Music 24/7: study music, focus, think, meditation, relaxing music',
  views:'1235',
},
{
  img:'https://i.ytimg.com/vi/36YnV9STBqc/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBvMJHTmNfBKNe-cKpL_KjrhxXuvQ',
  title:'The Good Life Radio • 24/7 Live Radio | Best Relax House, Chillout, Study, Running, Gym, Happy Music',
  views:'1234',
},
];


function Chatroom(){
  return(
    <section className='chatroom'>
      {rooms.map((room) => {
        const {img,title,views} = room;
        return <Room room={room}></Room>;
      })}
    </section>
  );
}
const Room = (props) =>{
  const {img,title,views} = props.room;
  return(
    <article className='chatroom'>
      <img src={img}/>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><h1>{title}</h1></a>
      <h4>{views} listeners</h4>
    </article>
  )
};
export default Chatroom;
