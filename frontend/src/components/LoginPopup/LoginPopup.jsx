import React, {useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
const LoginPopup = ({ setShowLogin }) => {



const {url, setToken} = useContext(StoreContext)


  const [currectState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name:"",
    email:"",
    password:""
  })

const onChangeHandler=(event)=>{
  const name = event.target.name;
  const value = event.target.value;
  setData(data=>({...data,[name]:value}))
}

  const onLogin = async(event)=>{
    event.preventDefault()

    let newUrl = url;
    if(currectState==="Login"){
      newUrl += "/api/user/login"
    }
    else{
      newUrl += "/api/user/register"
    }
    const response = await axios.post(newUrl,data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token",response.data.token);
      setShowLogin(false)
    }
    else{
      alert(response.data.message)
    }
  }

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currectState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-input">
          {currectState === "Login" ? (
            <></>
          ) : (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Enter Your name" required />
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Enter your email" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Enter your Password" required />
        </div>
        <button type="submit">
          {currectState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
          By continuing, I agree to the Terms of Service and Privacy Policy.
          </p>
        </div>
        {currectState === "Login" ? (
          <p>
            Create a new account? <span onClick={()=>setCurrentState("Sign Up")}>click here</span>
          </p>
        ) : (
          <p>
            Already have an account? <span onClick={()=>setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
