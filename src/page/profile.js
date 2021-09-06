import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const Profile = () => {
    return (
        <div className="container main">
            
            <div className="card">
                <div className="card-header">
                    <h1>Profile</h1>
                </div>

                <div className="card-body">
                    <Form>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="text" 
                            name="currentEmail" 
                            id="currentEmail"
                            placeholder="liam.tran@student.uts.edu.au"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Username</Label>
                            <Input type="text" 
                            name="currentUsername" 
                            id="currentUsername" 
                            placeholder="liamtran10"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="text" 
                            name="currentPassword" 
                            id="currentPassword"
                            placeholder="advancedsoftwaredesign" />
                        </FormGroup>
                                   
                        <Button color="primary" className="mt-2">Update</Button>

                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Profile;