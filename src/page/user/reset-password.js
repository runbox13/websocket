import axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

class ResetPassword extends React.Component {
    constructor() {
        super()
        this.state = {
            id: null,
            email: '',
            display_name: '',
            bio: '',
            avatar: null,
            currPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
        this.submitReset = this.submitReset.bind(this);
    }

    componentDidMount(){
        this.fetchUser();
    }

    fetchUser() {
        this.setState({
            email: this.props.user.email,
            display_name: this.props.user.display_name,
            bio: this.props.user.bio,
            avatar: this.props.user.avatar
        })
    }

    inputCurrentPassword = (event) => {
        this.setState({ currPassword: event.target.value });
    }

    inputNewPassword = (event) => {
        this.setState({ newPassword: event.target.value });
    }

    inputConfirmedPassword = (event) => {
        this.setState({ confirmPassword: event.target.value });
    }

    submitReset(event) {
        const { currPassword, newPassword, confirmPassword } = this.state;
        const passwordExists = currPassword === this.props.user.password;
        const matches = newPassword === confirmPassword;

        if (passwordExists) {

            if (matches) {
                axios.put("http://localhost:8000/user/1", {
                    password: this.state.confirmPassword
                }).then((response) => {

                    // this.props.dispatch({
                    //     type: 'USER_SESSION',
                    //     payload: response.data.user
                    // })
                    console.log(response)
                    this.props.history.push('/reset-password')
                    alert("Password reset.")

                }).catch(error => {
                    alert(error)
                    console.log(error)
                })

            } else {
                alert("Passwords do not match")
            }

        } else {
            alert("Current password incorrect.")
        }

        event.preventDefault();
    }

    render() {
        return (
            <div className="container main">

                <h1 className="mb-4">Reset Password</h1>

                <Form onSubmit={this.submitReset}>
                    <FormGroup>
                        <Label for="currPassword">Current Password:</Label>
                        <Input type="password"
                            name="currPassword"
                            id="currPassword"
                            placeholder="Enter current password."
                            onChange={this.inputCurrentPassword} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="newPassword">New Password:</Label>
                        <Input type="password"
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter new password."
                            onChange={this.inputNewPassword} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="confirmPassword">Confirm Password:</Label>
                        <Input type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Re-enter new password."
                            onChange={this.inputConfirmedPassword} />
                    </FormGroup>

                    <Button color="primary" className="mt-2">Reset Password</Button>
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
)(ResetPassword);