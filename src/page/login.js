import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const Login = () => {
    return (
        <div className="container main">
            
            <div className="card">
                <div className="card-header">
                    <h1>Login</h1>
                </div>

                <div className="card-body">
                    <Form>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password" />
                        </FormGroup>
                        
                        <Button color="primary" className="mt-2">Submit</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;