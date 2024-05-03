import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin as Google } from "@react-oauth/google";

function LogInGoogle({ buttonText }) {
  const navigate = useNavigate();
  const registerLoginWithGoogleAction = async (accessToken) => {
    console.log("token ", accessToken);
    try {
      let data = JSON.stringify({
        access_token: accessToken,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://shy-cloud-3319.fly.dev/api/v1/auth/google`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      const { token } = response.data.data;
      console.log("response.data ", response.data);
      localStorage.setItem("token", token);
      navigate("/home", { state: { token: token } });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return;
      }
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (responseGoogle) => {
      localStorage.setItem("login", "google function");
      registerLoginWithGoogleAction(responseGoogle.access_token);
    },
  });

  return (
    <>
      <button variant="primary" onClick={() => loginWithGoogle()}>
        {buttonText}
      </button>
      <Google
        onSuccess={(credentialResponse) => {
          localStorage.setItem("token", credentialResponse.credential);
          localStorage.setItem("login", "google component");
          navigate("/home", {
            state: { token: credentialResponse.credential },
          });
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
}

export default LogInGoogle;
