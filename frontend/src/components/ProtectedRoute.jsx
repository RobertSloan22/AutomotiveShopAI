import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { authUser, loading } = useAuthContext();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!authUser) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute; 