import React from 'react'
import { connect } from 'react-redux'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

class ManageProfile extends React.Component {
    constructor() {
        super()
        this.state = { 
        }
    }

    render() {
        return (
            <div className="container main">
                
                <h1 className="mb-4">Manage Profile</h1>

                <Form>
                    <FormGroup>
                        <Label for="email">Email:</Label>
                        <Input type="text" 
                            name="email" 
                            id="email" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="displayName">Display Name:</Label>
                        <Input type="text" 
                            name="displayName" 
                            id="displayName" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="password">Password:</Label>
                        <Input type="password" 
                            name="password" 
                            id="password" />
                    </FormGroup>
                    
                    <Button color="primary" className="mt-2">Update</Button>
                    &nbsp;&nbsp;&nbsp;       
                    <Button color="danger" className="mt-2">Delete</Button>
                    
                </Form>
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
)(ManageProfile);