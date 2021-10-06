import axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap'
import { FormErrors } from '../../FormErrors';

class ResetPassword extends React.Component {
    constructor() {
        super()
        this.state = {

            id: null,
            email: '',
            display_name: '',
            password:'',
            bio: '',
            avatar: null,

            currPassword: '',
            newPassword: '',
            confirmPassword: '',

            formErrors: { newPassword: '', confirmPassword: '' },
            newPassValid: false,
            confirmPassValid: false,

            mismatchPasswordAlert: false,
            incorrectCurrPassAlert: false,
            resetSuccessAlert: false
        }
        this.submitReset = this.submitReset.bind(this);
        this.dismissSuccessAlert = this.dismissSuccessAlert.bind(this)
        this.dismissMismatchAlert = this.dismissMismatchAlert.bind(this)
        this.dismissIncorrectAlert = this.dismissIncorrectAlert.bind(this)
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let newPassValid = this.state.newPassValid;
        let confirmPassValid = this.state.confirmPassValid;

        switch (fieldName) {
            case 'newPassword':
                newPassValid = value.length >= 5;
                fieldValidationErrors.newPassword = newPassValid ? '' : ' is too short, minimum 5 letters.';
                break;
            case 'confirmPassword':
                confirmPassValid = value.length >= 5;
                fieldValidationErrors.confirmPassword = confirmPassValid ? '' : ' is too short, minimum 5 letters.';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            newPassValid: newPassValid,
            confirmPassValid: confirmPassValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.newPassValid && this.state.confirmPassValid });
    }


    // onChange functions for user input in password fields.
    inputCurrentPassword = (event) => {
        this.setState({ currPassword: event.target.value });
    }

    inputNewPassword = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        }, () => { this.validateField(name, value) })
    }

    inputConfirmedPassword = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        }, () => { this.validateField(name, value) })
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
                    email: this.props.user.email,
                    display_name: this.props.user.display_name,
                    password: this.state.confirmPassword,
                    bio: this.props.user.bio,
                    avatar: this.props.user.avatar

                }).then((response) => {

                    //dispatch USER_SESSION action to save user data to redux store
                    this.props.dispatch({
                        type: 'USER_SESSION',
                        payload: response.data
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

                <h1 className="mb-4" data-testid="resetPassHeader">Reset Password</h1>

                <div><FormErrors formErrors={this.state.formErrors} /></div>

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
                            value={this.state.newPassword}
                            onChange={this.inputNewPassword} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="confirmPassword">Confirm Password:</Label>
                        <Input type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Re-enter new password."
                            value={this.state.confirmPassword}
                            onChange={this.inputConfirmedPassword} />
                    </FormGroup>

                    {
                        !this.state.formValid
                            ? <Button color="primary" className="mt-2" disabled>Reset Password</Button>
                            : <Button color="primary" className="mt-2">Reset Password</Button>
                    }

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