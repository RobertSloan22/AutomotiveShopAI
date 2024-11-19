import { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import { Toaster } from 'react-hot-toast';

const SignUp = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		fullName: "",
		gender: ""
	});

	const { loading, signup } = useSignup();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(formData);
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sign Up <span className='text-blue-500'>HD-Auto-Chat</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Full Name</span>
						</label>
						<input
							type='text'
							name="fullName"
							placeholder='John Doe'
							className='w-full input input-bordered h-10'
							value={formData.fullName}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Email</span>
						</label>
						<input
							type='email'
							name="email"
							placeholder='john@example.com'
							className='w-full input input-bordered h-10'
							value={formData.email}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							name="password"
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={formData.password}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							name="confirmPassword"
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
					</div>

					<div className="mt-4">
						<label className='label p-2'>
							<span className='text-base label-text'>Gender</span>
						</label>
						<div className="flex gap-4">
							<label className="flex items-center gap-2">
								<input
									type="radio"
									name="gender"
									value="male"
									checked={formData.gender === "male"}
									onChange={handleChange}
									className="radio radio-primary"
								/>
								<span className="text-gray-300">Male</span>
							</label>
							<label className="flex items-center gap-2">
								<input
									type="radio"
									name="gender"
									value="female"
									checked={formData.gender === "female"}
									onChange={handleChange}
									className="radio radio-primary"
								/>
								<span className="text-gray-300">Female</span>
							</label>
						</div>
					</div>

					<div>
						<button 
							className='btn btn-block btn-sm mt-4'
							disabled={loading}
						>
							{loading ? (
								<span className='loading loading-spinner'></span>
							) : (
								"Sign Up"
							)}
						</button>
					</div>
				</form>

				<Link 
					to='/login'
					className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'
				>
					Already have an account?
				</Link>
			</div>
			<Toaster position="top-center" reverseOrder={false} />
		</div>
	);
};

export default SignUp;