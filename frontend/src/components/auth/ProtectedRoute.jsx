import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

const ProtectedRoute = ({ children }) => {
    const { authUser } = useAuthContext();

    if (!authUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 