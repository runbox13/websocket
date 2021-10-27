import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Button,
    Spinner
} from 'reactstrap'

class UpdateRoom extends React.Component {
    constructor() {
        super()
        this.state = {
            id: null,
            name: '',
            description: '',
            isLoaded: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        let params = new URLSearchParams(window.location.search)
        this.setState({id: params.get('id')})

        axios
            .get(this.props.api + 'room/' + params.get('id'))
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    name: response.data.name,
                    description: response.data.description,
                })
            }).catch(error => {
                alert(error)
                console.log(error)
            })
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
            .put(this.props.api + 'room/' + this.state.id, {
                name: this.state.name,
                description: this.state.description
            }, {
                headers: {
                    'Authorization': `Bearer ${this.props.user.api_key}`
                }
            })
            .then(() => {
                // redirect back to manage rooms page
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
                <h1 className="mb-4">Update Room</h1>
                
                {!this.state.isLoaded &&
                    <Spinner color="primary" />
                }

                {this.state.isLoaded &&
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
                            <Button color="primary" className="mr-10">Update</Button>
                            <Button
                                onClick={() => this.props.history.push('/manage-rooms')}>Cancel</Button>
                        </div>
                    </Form>
                }
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
)(UpdateRoom);