import {
  createContext,
  useContext,
  useState,
} from "react";

import API from "../services/api";

const AuthContext =
  createContext();

export const AuthProvider =
  ({ children }) => {

    const [user, setUser] =
      useState(
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        ) || null
      );

    // ----------------
    // LOGIN
    // ----------------
    const login =
      async (
        email,
        password
      ) => {
        try {
          const response =
            await API.post(
              "/auth/login",
              {
                email,
                password,
              }
            );

          const {
            token,
            user,
          } =
            response.data;

          // Save token
          localStorage.setItem(
            "token",
            token
          );

          // Save user
          localStorage.setItem(
            "user",
            JSON.stringify(
              user
            )
          );

          setUser(user);

          return {
            success: true,
          };
        } catch (error) {
          return {
            success: false,
            message:
              error.response
                ?.data
                ?.message ||
              "Login Failed",
          };
        }
      };

    // ----------------
    // REGISTER
    // ----------------
    const register =
      async (
        name,
        email,
        password,
        role
      ) => {
        try {
          const response =
            await API.post(
              "/auth/register",
              {
                name,
                email,
                password,
                role,
              }
            );

          return {
            success: true,
            data:
              response.data,
          };
        } catch (error) {
          return {
            success: false,
            message:
              error.response
                ?.data
                ?.message ||
              "Registration Failed",
          };
        }
      };

    // ----------------
    // LOGOUT
    // ----------------
    const logout = () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      setUser(null);

      window.location.href =
        "/";
    };

    return (
      <AuthContext.Provider
        value={{
          user,
          login,
          register,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

// ----------------
// CUSTOM HOOK
// ----------------
export const useAuth =
  () =>
    useContext(
      AuthContext
    );