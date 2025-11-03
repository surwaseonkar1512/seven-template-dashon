import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface Props {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user?.token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user?.user?.role || ''))
        return <Navigate to="/unauthorized" replace />;

    return <>{children}</>;
};

export default PrivateRoute;
