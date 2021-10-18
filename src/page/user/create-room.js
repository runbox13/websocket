import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Button
} from 'reactstrap'

class CreateRoom extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            description: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const target = event.target
        const value = target.value
        const name = target.name
    
        this.setState({
          [name]: value
        })
    }

    handleSubmit(event) {
        axios
            .post(this.props.api + 'room/store', {
                userId: this.props.user.id,
                name: this.state.name,
                description: this.state.description
            }, {
                headers: {
                    'Authorization': `Bearer ${this.props.user.api_key}`
                }
            })
            .then((response) => {
                console.log(response.data)
                // redirect back to manage rooms
                this.props.history.push('/manage-rooms')
            }).catch(error => {
                alert(error)
                console.log(error)
            })

        event.preventDefault()
    }

    render() {
        return (
            <div className="container main">
                <h1 className="mb-4">Create Room</h1>

                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name:</Label>
                        <Input type="text" 
                            id="name" 
                            name="name" 
                            value={this.state.name} 
                            onChange={this.handleChange} 
                            required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="desc">Description:</Label>
                        <Input type="textarea" 
                            name="description" 
                            id="desc" 
                            value={this.state.description} 
                            onChange={this.handleChange} 
                            required />
                    </FormGroup>
                    
                    <div className="mt-2">
                        <Button color="primary" className="mr-10">Create</Button>
                        <Button
                            onClick={() => this.props.history.push('/manage-rooms')}>Cancel</Button>
                    </div>
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
)(CreateRoom);