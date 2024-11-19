import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    const signup = async (formData) => {
        const { fullName, email, password, confirmPassword, gender } = formData;
        
        if (!validateInput(formData)) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    username: email,
                    password,
                    confirmPassword,
                    gender
                }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Signup failed");
            }

            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data);
            toast.success("Signup successful!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;

function validateInput({ fullName, email, password, confirmPassword, gender }) {
    if (!fullName || !email || !password || !confirmPassword || !gender) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (!email.includes('@')) {
        toast.error("Please enter a valid email address");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
}