import React from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import axios from 'axios';
import { Card, Button, CardText, CardTitle, CardBody } from 'reactstrap'; 



function PlaceHolder(props){
    var cards = [];

    console.log(props.createdRooms);
    for (var i = 0; i < props.createdRooms.length; ++i){
    
   
        cards.push(
            
            <Card>
                <CardBody>
                    <CardTitle> {props.createdRooms[i].name}</CardTitle>
                    <CardText>{props.createdRooms[i].description}</CardText>
                    <Button variant="primary" href={"http://localhost:3000/chatroom?id=" + props.createdRooms[i].id}>Go to Chatroom</Button>
                </CardBody>
            </Card>
        );
    }
    return (cards);
}



class Profile extends React.Component {
    constructor() {
        super()
        this.state = {         
            users: [] ,
            createdRooms: []
                

        }
    }


           

        componentDidMount() {
        var id = window.location.href.split('=').pop()
          
        

         axios
         .get(this.props.api + "user/" + id)
         .then (res => {
             const data = res.data;
             console.log(data)
            this.setState({users: data});
         })
        
         axios
         .get(this.props.api + "room/created-by/" + id)
         .then(res => {
             const data = res.data;

             this.setState({createdRooms: data});
                //console.log(data);
                // (previous => { 
                // var newState = previous;
                // newState.createdRooms.push(data); 
                // return newState});

         })
        
        }

    
    

        

    

    render() {
        return (
            <div className="container main">
                <div className="mb-4">
                    
                
                    <img src={this.state.users.avatar} alt={this.state.users.display_name} width = "100" height = "100" /> 
                     <h1> {this.state.users.display_name}</h1>           
                     
                </div>

                <Tabs>
                    <TabList>
                        <Tab>Created Channels</Tab>
                        <Tab> Bio </Tab>
                    </TabList>

                    
                     
                    <TabPanel>
                        
                    <PlaceHolder api={this.props.api} createdRooms={this.state.createdRooms}>  </PlaceHolder>

                     
                    </TabPanel>

                    

                    <TabPanel>
                        { <p> {this.state.users.bio} </p> }
                       
                        
                        
                    </TabPanel>
                </Tabs>
            </div> 
        )
    }
}



const mapStateToProps = state => {
    return { 
        api: state.api,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);