import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthContext } from "../../hooks/useAuthContext";

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("chat-user"));
		setAuthUser(user);
		setLoading(false);
	}, []);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
			{!loading && children}
		</AuthContext.Provider>
	);
}; 