import React from 'react';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import { Navigate } from 'react-router-dom';

// Admin pages
import { DashboardOverview } from '../components/DashboardOverview';
import { UserManagement } from '../components/UserManagement';
import { TemplateManagement } from '../components/TemplateManagement';
import { TemplatePreviewTab } from '../components/TemplatePreviewTab';
import { AboutUsManagement } from '../components/AboutUsManagement';
import { ContactUsManagement } from '../components/ContactUsManagement';
import { AchievementsManagement } from '../components/AchievementsManagement';
import { AdminCreateUser } from '../components/AdminCreateUser';
import { HomePageManagement } from '../pages/HomePageMangment';



export const publicRoutes = [
    { path: '/login', name: 'Login', component: <Login /> },
];

export const authProtectedRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: <Dashboard />,
        allowedRoles: ['admin', 'user'],
        children: [
            { path: '', element: <DashboardOverview mode="admin" /> },
            { path: 'overview', element: <DashboardOverview mode="admin" /> },
            { path: 'users', element: <UserManagement /> },
            { path: 'create-user', element: <AdminCreateUser /> },
            { path: 'templates', element: <TemplateManagement /> },
            { path: 'template-preview', element: <TemplatePreviewTab /> },
            { path: 'sections', element: <HomePageManagement /> },
            { path: 'about-us', element: <AboutUsManagement /> },
            { path: 'contact-us', element: <ContactUsManagement /> },
            { path: 'achievements', element: <AchievementsManagement /> },
            // { path: 'settings', element: <GlobalSettings /> },
            // { path: 'notifications', element: <NotificationsLogs /> },
            // { path: 'profile', element: <ProfileSettings mode="admin" /> },
            { path: '*', element: <Navigate to="/dashboard" /> },
        ],
    },
];
