import React from 'react'
import { Alert } from 'reactstrap'

const NotFound = () => {
    return (
        <div className="container main">
            <h1 className="mb-4">404 Not Found</h1>
            <Alert color="warning">Are you sure <b>{window.location.pathname}</b> is what your looking for?</Alert>
        </div>
    );
};

export default NotFound;