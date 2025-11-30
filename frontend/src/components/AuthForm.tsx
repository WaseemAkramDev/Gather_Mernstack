import { useState } from "react";
import { signup, useSignin } from "../api/authenticate";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signinMutation = useSignin();
  const [isSubmitting, setisSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    setisSubmitting(true);
    try {
      e.preventDefault();
      if (isSignUp) {
        const res = await signup(formData.username, formData.password);
        if (res.userId) {
          setIsSignUp(false);
          toast.success("signup Successfull!");
        }
      } else {
        await signinMutation.mutateAsync({
          username: formData.username,
          password: formData.password,
        });
      }
    } catch (e) {
      setisSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Gather
        </h1>
        <p className="text-gray-600">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required={isSignUp}
          />
        </div>
        {isSignUp && (
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required={isSignUp}
            />
          </div>
        )}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-[0.5] flex items-center justify-center gap-2"
        >
          {isSignUp ? "Create Account" : "Sign in with email"}{" "}
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>

      <div className="mt-8 pt-6  border-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          {isSignUp
            ? "By signing up, you agree to our Terms and Privacy Policy"
            : " "}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
