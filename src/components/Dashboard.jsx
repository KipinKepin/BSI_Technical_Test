import React from 'react';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1>Welcome to the Dashboard</h1>
                <div className="d-flex justify-content-center mt-4">
                    <NavLink to="/login" className="btn btn-primary mx-2">
                        Login
                    </NavLink>
                    <NavLink to="/register" className="btn btn-secondary mx-2">
                        Register
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;