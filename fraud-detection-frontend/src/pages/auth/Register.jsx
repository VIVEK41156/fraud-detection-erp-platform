import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Register({
  setIsLogin,
}) {
  const {
    register,
  } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "user",
    });

  const handleChange = (
    e
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const res =
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );

      if (res.success) {
        alert(
          "Registration Successful"
        );

        setIsLogin(
          true
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
        Create Account
      </h1>

      <p className="text-slate-400 text-center mt-2 mb-8">
        Register to continue
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={
            handleChange
          }
          className="w-full bg-slate-800 p-4 rounded-2xl outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={
            handleChange
          }
          className="w-full bg-slate-800 p-4 rounded-2xl outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={
            handleChange
          }
          className="w-full bg-slate-800 p-4 rounded-2xl outline-none"
        />

        <select
          name="role"
          onChange={
            handleChange
          }
          className="w-full bg-slate-800 p-4 rounded-2xl outline-none"
        >
          <option value="user">
            User
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all p-4 rounded-2xl font-semibold">
          Register
        </button>
      </form>

      <p className="text-center text-slate-400 mt-6">
        Already have an account?{" "}

        <button
          onClick={() =>
            setIsLogin(
              true
            )
          }
          className="text-indigo-400"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;