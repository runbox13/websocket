//import axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap'
import { FormErrors } from '../../helper/error-alert'

class ResetPassword extends React.Component {
    constructor() {
        super()
        this.state = {
            password: '',
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
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({ [name]: value })
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
        const { newPassword, confirmPassword } = this.state;    
        const matches = newPassword === confirmPassword;

        // If the new password matches the confirmed password, fetch user data via id
        // and update password.
        if (matches) {
            this.postResetPassword()
        } else {
            // alert to user that passwords do not match.
            this.setState({ mismatchPasswordAlert: !this.state.mismatchPasswordAlert })
        }

        event.preventDefault();
    }

    postResetPassword() {
        axios
            .post(this.props.api + 'user/password-reset', {
                user_id: this.props.user.id,
                password: this.state.password,
                new: this.state.newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${this.props.user.api_key}`
                }
            })
            .then((res) => {
                console.log(res)

                this.props.history.push('/reset-password')

                // alert to user that password has been reset
                this.setState({ resetSuccessAlert: !this.state.resetSuccessAlert })
            }).catch(error => {
                alert(error)
                console.log(error)
            })
    }

    // dismiss functions to close alerts.
    dismissSuccessAlert() { this.setState({ resetSuccessAlert: !this.state.resetSuccessAlert }) }
    dismissMismatchAlert() { this.setState({ mismatchPasswordAlert: !this.state.mismatchPasswordAlert }) }

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

                <Form onSubmit={this.submitReset}>
                    <FormGroup>
                        <Label for="currPassword">Current Password:</Label>
                        <Input type="password"
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.inputCurrentPassword} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="newPassword">New Password:</Label>
                        <Input type="password"
                            name="newPassword"
                            id="newPassword"
                            value={this.state.newPassword}
                            onChange={this.inputNewPassword} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="confirmPassword">Confirm Password:</Label>
                        <Input type="password"
                            name="confirmPassword"
                            id="confirmPassword"
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