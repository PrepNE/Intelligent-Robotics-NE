import PageLoader from '@/components/shared/PageLoader';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean, children: React.ReactElement }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, navigate]);

    return loading ? <PageLoader /> : children;
};

export default ProtectedRoute;