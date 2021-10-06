import axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap'

class ResetPassword extends React.Component {
    constructor() {
        super()
        this.state = {
            currPassword: '',
            newPassword: '',
            confirmPassword: '',
            mismatchPasswordAlert: false,
            incorrectCurrPassAlert: false,
            resetSuccessAlert: false
        }
        this.submitReset = this.submitReset.bind(this);
        this.dismissSuccessAlert = this.dismissSuccessAlert.bind(this)
        this.dismissMismatchAlert = this.dismissMismatchAlert.bind(this)
        this.dismissIncorrectAlert = this.dismissIncorrectAlert.bind(this)
    }


    // onChange functions for user input in password fields.
    inputCurrentPassword = (event) => {
        this.setState({ currPassword: event.target.value });
    }

    inputNewPassword = (event) => {
        this.setState({ newPassword: event.target.value });
    }

    inputConfirmedPassword = (event) => {
        this.setState({ confirmPassword: event.target.value });
    }

    // Reset password button handler.
    submitReset(event) {
        const { currPassword, newPassword, confirmPassword } = this.state;
        const passwordExists = currPassword === this.props.user.password;
        const matches = newPassword === confirmPassword;

        if (passwordExists) {

            // If the new password matches the confirmed password, fetch user data via id
            // and update password.
            if (matches) {
                axios.put(this.props.api + 'user/' + this.props.user.id, {
                    password: this.state.confirmPassword
                }).then((response) => {

                    //dispatch USER_SESSION action to save user data to redux store
                    this.props.dispatch({
                        type: 'USER_SESSION',
                        payload: response.data.user
                    })

                    // reload component
                    this.props.history.push('/reset-password')

                    // alert to user that password has been reset.
                    this.setState({ resetSuccessAlert: !this.state.resetSuccessAlert })

                }).catch(error => {
                    alert(error)
                    console.log(error)
                })

            } else {
                // alert to user that passwords do not match.
                this.setState({ mismatchPasswordAlert: !this.state.mismatchPasswordAlert })
            }

        } else {
            // alert to user that inputted current password is incorrect.
            this.setState({ incorrectCurrPassAlert: !this.state.incorrectCurrPassAlert })
        }

        event.preventDefault();
    }

    // dismiss functions to close alerts.
    dismissSuccessAlert() { this.setState({ resetSuccessAlert: !this.state.resetSuccessAlert }) }
    dismissMismatchAlert() { this.setState({ mismatchPasswordAlert: !this.state.mismatchPasswordAlert }) }
    dismissIncorrectAlert() { this.setState({ incorrectCurrPassAlert: !this.state.incorrectCurrPassAlert }) }

    render() {
        return (
            <div className="container main">

                <h1 className="mb-4">Reset Password</h1>

                <Alert color="success"
                    isOpen={this.state.resetSuccessAlert}
                    toggle={this.dismissSuccessAlert}>Password successfully reset.</Alert>

                <Alert color="warning"
                    isOpen={this.state.mismatchPasswordAlert}
                    toggle={this.dismissMismatchAlert}>Passwords do not match.</Alert>

                <Alert color="danger"
                    isOpen={this.state.incorrectCurrPassAlert}
                    toggle={this.dismissIncorrectAlert}>Current password incorrect.</Alert>


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