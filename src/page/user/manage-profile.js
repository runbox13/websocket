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
        this.state =
        {
            // Initialise empty state to pass user data.
            id: null,
            email: '',
            display_name: '',
            password: '',
            description: '',
            avatar: null,
            formErrors: { email: '' },
            emailValid: true,
            passwordValid: true,
            displaynameValid: true
        }

        this.handleReset = this.handleReset.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleDelete = this.handleDelete.bind(this)

        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
    }

    componentDidMount() {
        // Load user details into state if component successfully runs.
        this.fetchUser();
    }

    fetchUser() {
        // Fetch user details and pass data into the empty state
        axios.get('http://localhost:5000/users/1', {
        })
            .then((response) => {
                console.log(response.data)
                this.setState({
                    email: response.data.email,
                    display_name: response.data.display_name,
                    password: response.data.password,
                    description: response.data.description,
                })
            })
            .catch((error) => {
                alert(error)
                console.log(error);
            })
    }

    fileSelectedHandler = (e) => {
        console.log(e.target.files[0])
        this.setState({
            avatar: URL.createObjectURL(e.target.files[0])
        })
    }

    handleUpdate(event) {
        axios.put('http://localhost:5000/users/1', {
            email: this.state.email,
            display_name: this.state.display_name,
            password: this.state.password,
            description: this.state.description,
        })
            .then(() => {
                this.props.history.push('/manage-profile')
            }).catch(error => {
                alert(error)
                console.log(error)
            })

        event.preventDefault();
    }


    // Reload screen to reset state back to original.
    handleReset() {
        if (window.confirm("Are you sure you want to reset all changes?")) {
            window.location.reload()
        }
    }

    // Redirect user back to register/login screen 
    handleDelete() {
        if (window.confirm("Are you sure you want to remove your profile?")) {
            this.props.history.push('/');
        }
    }

    /** 
    handleDelete() {
        if (window.confirm("Are you sure you want to remove your profile?")) {
            axios.delete("http://localhost:5000/users" + id)
                .then((res) => {
                    console.log(response)
                    this.props.history.push('/')
                })
        }
    }
    **/
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        let displaynameValid = this.state.displaynameValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'display_name':
                displaynameValid = value.length >= 5;
                fieldValidationErrors.display_name = displaynameValid ? '' : ' is too short, minimum 5 letters.';
                break;
            case 'password':
                passwordValid = value.length >= 5;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short, minimum 5 letters.';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            emailValid: emailValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.emailValid && this.state.passwordValid && this.state.displaynameValid});
    }

    handleChange(event) {
        //console.log(event)
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            [name]: value
        }, () => { this.validateField(name, value) })
    }


    render() {
        return (
            <div className="container main">

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
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="display_name">Display Name:</Label>
                        <Input type="text"
                            name="display_name"
                            id="display_name"
                            value={this.state.display_name}
                            onChange={this.handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="password">Password:</Label>
                        <Input type="text"
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description:</Label>
                        <Input type="text"
                            name="description"
                            id="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="avatar">Avatar:</Label>
                        &nbsp;&nbsp;&nbsp;
                        <Input type="file"
                            name="file"
                            id="exampleFile"
                            onChange={this.fileSelectedHandler}
                        />
                    </FormGroup>

                    <FormGroup>
                        <img src={this.state.avatar} width="300" height="300" alt="" />
                    </FormGroup>



                    {
                        !this.state.formValid
                            ? <Button color="primary" className="mt-2" disabled>Update</Button>
                            : <Button color="primary" className="mt-2">Update</Button>
                    }

                    {/*                     
                    <Button color="primary"
                        className="mt-2"
                    disabled={this.state.formValid}>Update</Button> */}

                    &nbsp;&nbsp;&nbsp;

                    <Button
                        onClick={this.handleReset}
                        color="warning"
                        className="mt-2">Reset</Button>
                    &nbsp;&nbsp;&nbsp;

                    <Button
                        onClick={this.handleDelete}
                        color="danger"
                        className="mt-2">Delete</Button>

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