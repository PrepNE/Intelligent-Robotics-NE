import PageLoader from '@/components/shared/PageLoader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean, children: React.ReactElement }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, navigate]);

    return loading ? <PageLoader /> : children;
};

export default PublicRoute;
