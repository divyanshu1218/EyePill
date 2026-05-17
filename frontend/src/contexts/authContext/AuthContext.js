import { createContext, useState } from "react";
import { loginService, signupService } from "../../api/apiServices";
import { notify } from "../../utils/utils";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const signupHandler = async ({
    username = "",
    email = "",
    password = "",
  }) => {
    setSigningUp(true);
    try {
      const response = await signupService(username, email, password);
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response?.data)
        );
        setToken(response?.data?.token);
        setUserInfo(response?.data);
        notify("success", "Signed Up Successfully!!");
      }
    } catch (err) {
      console.log(err);
      const errorMessage = err?.response?.data?.errors 
        ? err?.response?.data?.errors[0] 
        : err?.response?.data?.message 
        || "Some Error Occurred!!";
      notify("error", errorMessage);
    } finally {
      setSigningUp(false);
    }
  };

  const loginHandler = async ({ email = "", password = "" }) => {
    setLoggingIn(true);
    try {
      const response = await loginService(email, password);
      console.log({ response });
      if (response.data.success) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response?.data)
        );
        setToken(response?.data?.token);
        setUserInfo(response?.data);
        notify("success", "Logged In Successfully!!");
      }
    } catch (err) {
      console.log(err);
      const errorMessage = err?.response?.data?.errors 
        ? err?.response?.data?.errors[0] 
        : err?.response?.data?.message 
        || "Some Error Occurred!!";
      notify("error", errorMessage);
    } finally {
      setLoggingIn(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setToken(null);
    notify("info", "Logged out successfully!!", 100);
  };

  const handleGoogleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(user));
    setToken(token);
    setUserInfo(user);
    notify("success", "Logged In Successfully!!");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loggingIn,
        loginHandler,
        logoutHandler,
        signupHandler,
        signingUp,
        userInfo,
        setUserInfo,
        handleGoogleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
