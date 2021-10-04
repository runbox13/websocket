import React from 'react';
import { connect } from 'react-redux'
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
import axios from 'axios';
import { FormErrors } from '../../FormErrors';


class ManageProfile extends React.Component {
    constructor() {
        super()
        this.state = {
            // Initialise empty state to pass user data.
            id: null,
            email: '',
            display_name: '',
            bio: '',
            avatar: null,
            formErrors: { email: '' },
            emailValid: true,
            displaynameValid: true,
            bioValid: true
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleDelete = this.handleDelete.bind(this)

        this.handleFileSelect = this.handleFileSelect.bind(this)
    }

    componentDidMount() {
        // Pass user into state if component runs
        this.fetchUser();
    }

    // Fetch user from redux store.
    fetchUser() {
        this.setState({
            email: this.props.user.email,
            display_name: this.props.user.display_name,
            bio: this.props.user.bio,
            avatar: this.props.user.avatar
        })
    }

    // Validation for inputs. 
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let displaynameValid = this.state.displaynameValid;
        let bioValid = this.state.bioValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'display_name':
                displaynameValid = value.length >= 5;
                fieldValidationErrors.display_name = displaynameValid ? '' : ' is too short, minimum 5 letters.';
                break;
            case 'bio':
                bioValid = value.length >= 20;
                fieldValidationErrors.bio = bioValid ? '' : ' is too short, minimum 250 letters.';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
        }, this.validateForm);
    }

    // Whether form is valid or not. 
    validateForm() {
        this.setState({ formValid: this.state.emailValid && this.state.displaynameValid && this.state.bioValid });
    }

    handleChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        }, () => { this.validateField(name, value) })
    }

    handleFileSelect = (e) => {
        this.setState({
            avatar: URL.createObjectURL(e.target.files[0])
        })
    }

    // Reset state to user info in redux store.
    handleReset() {
        if (window.confirm("Are you sure you want to reset all changes?")) {
            this.fetchUser();
        }
    }

    handleUpdate(e) {
        axios.put(this.props.api + 'user/' + this.props.user.id, {
            email: this.state.email,
            display_name: this.state.display_name,
            bio: this.state.bio,
            avatar: this.state.avatar
        })
            .then((response) => {

                // dispatch USER_SESSION action to save user data to redux store
                this.props.dispatch({
                    type: 'USER_SESSION',
                    payload: response.data.user
                })
                
                // reload component
                this.props.history.push('/manage-profile')
                
                // confirm to user profile details are updated..
            }).catch(error => {
                alert(error)
                console.log(error)
            })
        e.preventDefault();
    }
    
    handleDelete() {
        if (window.confirm("Are you sure you want to delete your profile?")) {
            axios.delete(this.props.api + 'user/' + this.props.user.id)
                .then((response) => {
                    console.log(response)
                    window.location.href = '/?account-deleted'
                });
        }
    }

    render() {
        return (
            <div className="container main manage-profile">

                <h1 className="mb-4">Manage Profile</h1>

                <div>
                    <FormErrors formErrors={this.state.formErrors} />
                </div>

                <Form onSubmit={this.handleUpdate}>
                    <FormGroup>
                        <Label for="email">Email:</Label>
                        <Input type="text"
                            name="email"
                            id="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            required />
                    </FormGroup>

                    <FormGroup>
                        <Label for="display_name">Display Name:</Label>
                        <Input type="text"
                            name="display_name"
                            id="display_name"
                            value={this.state.display_name}
                            onChange={this.handleChange}
                            required />
                    </FormGroup>

                    <FormGroup>
                        <Label for="bio">Bio:</Label>
                        <Input type="textarea"
                            name="bio"
                            id="bio"
                            value={this.state.bio}
                            onChange={this.handleChange}
                            required />
                    </FormGroup>

                    <FormGroup>
                        <Label className="avatar">Avatar:</Label>
                        &nbsp;&nbsp;&nbsp;
                        <Input type="file"
                            name="file"
                            id="exampleFile"
                            onChange={this.handleFileSelect} />
                    </FormGroup>

                    <FormGroup>
                        <img src={this.state.avatar} width="200" height="200" alt="" />
                    </FormGroup>


                    {
                        !this.state.formValid
                            ? <Button color="primary" className="mt-2" disabled>Update</Button>
                            : <Button color="primary" className="mt-2">Update</Button>
                    }

                    &nbsp;&nbsp;&nbsp;

                    <Button
                        onClick={this.handleReset}
                        color="warning"
                        className="mt-2">Reset
                    </Button>
                    &nbsp;&nbsp;&nbsp;

                    <Button
                        onClick={this.handleDelete}
                        color="danger"
                        className="mt-2">Delete
                    </Button>

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