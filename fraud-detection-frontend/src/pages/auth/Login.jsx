import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login({
  setIsLogin,
}) {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const res =
        await login(
          email,
          password
        );

      if (res.success) {
        navigate(
          "/dashboard"
        );
      } else {
        alert(
          res.message
        );
      }
    };

  return (
    <div className="text-white">

      <h1 className="text-4xl font-bold text-center">
        Welcome Back
      </h1>

      <p className="text-slate-400 text-center mt-2 mb-8">
        Login to continue
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full bg-slate-800 p-4 rounded-2xl outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={
            password
          }
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full bg-slate-800 p-4 rounded-2xl outline-none"
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all p-4 rounded-2xl">
          Login
        </button>
      </form>

      <p className="text-center text-slate-400 mt-6">
        Don't have an account?{" "}

        <button
          onClick={() =>
            setIsLogin(
              false
            )
          }
          className="text-indigo-400"
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;