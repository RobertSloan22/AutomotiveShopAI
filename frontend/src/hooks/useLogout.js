import { useAuthContext } from '../context/AuthContext';
import axios from '../utils/axiosConfig';

export const useLogout = () => {
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		try {
			await axios.post('/api/auth/logout');
			localStorage.removeItem('chat-user');
			setAuthUser(null);
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return { logout };
};
