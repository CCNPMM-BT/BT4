import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
    const { auth, appLoading } = useContext(AuthContext);
    const location = useLocation();

    if (appLoading) {
        return (
            <div style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        // Redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
