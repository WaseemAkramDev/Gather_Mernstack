import signinBg from "../assets/signin_bg.png";
import AuthForm from "../components/AuthForm";

function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
      style={{
        backgroundImage: `url(${signinBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AuthForm />
    </div>
  );
}

export default Login;
