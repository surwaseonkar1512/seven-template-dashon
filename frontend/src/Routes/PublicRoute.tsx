import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

interface Props {
    children: React.ReactNode;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    console.log('user', user)
    return user?.token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default PublicRoute;
