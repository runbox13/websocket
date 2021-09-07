import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

class Register extends React.Component {
    constructor() {
        super()
        this.state = { 
            email: '',
            password: '' 
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {

        axios
            .post(this.props.api + '/user/store', {
                email: this.state.email,
                password: this.state.password
            })
            .then((response) => {
                console.log(response.data);
                // dispatch USER_SESSION action to save user data to redux store
                this.props.dispatch({
                    type: 'USER_SESSION',
                    payload: response.data.user
                })
                // redirect to lobby
                this.props.history.push('/lobby');
            }).catch(error => {
                alert(error);
                console.log(error);
            });

        event.preventDefault();
    }

    render() {
        return (
            <div className="container main">
                
                <div className="col-md-8 mx-auto">
                    <div className="card bg-light">

                        <div className="card-header">
                            <h1>Register</h1>
                        </div>
    
                        <div className="card-body">
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input type="email" 
                                        id="email" 
                                        name="email" 
                                        value={this.state.email} 
                                        onChange={this.handleChange} 
                                        required />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input type="password" 
                                        name="password" 
                                        id="password" 
                                        value={this.state.password} 
                                        onChange={this.handleChange} 
                                        required />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="dob">DOB</Label>
                                    <Input type="date"
                                        name="dob"
                                        id="dob"
                                        placeholder="Date of Birth" />
                                </FormGroup>
                                
                                <Button color="primary" className="mt-2">Submit</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
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
)(Register);