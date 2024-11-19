import { useLogout } from '../../hooks/useLogout';
import { BiLogOut } from 'react-icons/bi';

const LogoutButton = () => {
	const { logout } = useLogout();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<button
			onClick={handleLogout}
			className="flex items-center gap-2 hover:bg-gray-700 py-2 px-4 w-full rounded transition-colors"
		>
			<BiLogOut className="text-xl" />
			<span>Logout</span>
		</button>
	);
};

export default LogoutButton;
