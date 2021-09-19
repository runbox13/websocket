import React from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';



class Profile extends React.Component {
    constructor() {
        super()
        this.state = { 
        }
    }

    render() {
        return (
            <><div className="container main">
                <h1>Profile</h1>
            
            
             

                <Tabs>
                    <TabList>
                        <Tab>Created Channels</Tab>
                        <Tab>Followed Channels</Tab>
                        <Tab>Bio</Tab>
                    </TabList>

                    /* get data from user to put into these tabs.
                     edit profile should affect bio */
                     

                    <TabPanel>
                    <p> Created channel </p>

                    </TabPanel>

                    <TabPanel>
                        <p> followed channels </p>
                    </TabPanel>

                    <TabPanel>
                        <p> Bio </p>
                    </TabPanel>

                </Tabs>

                </div> 
            
            </>
        )

        
    }
};

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