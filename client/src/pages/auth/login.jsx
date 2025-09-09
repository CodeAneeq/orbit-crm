import React from 'react'
import Navbar from '../../components/navbar/navbar'
import AuthInput from '../../components/input/auth-input'
import PrimaryBtn from '../../components/button/primary-btn'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../services/baseURL'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addUser } from '../../redux/features/user-slice'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const [loader, setLoader] = useState(false);

  async function login() {
    setLoader(true);
    try {
      const payload = { email, password };
      const res = await axios.post(`${baseURL}/auth/api/login`, payload);

      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.data.token);
        dispatch(addUser(res.data.data));
        navigate('/dashboard');
      } else {
        setAuthError("Invalid login attempt. Please try again.");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        const message = error.response.data.message.toLowerCase();
        if (message.includes("email")) {
          setEmailError(message);
        } else if (message.includes("password")) {
          setPasswordError(message);
        } else {
          setAuthError(message);
        }
      } else {
        setAuthError("Something went wrong, try again...");
      }
    } finally {
      setLoader(false);
    }
  }



  return (
    <div>
      <Navbar />
      <div className='w-full mt-10 px-30 flex flex-col items-center max-md:px-3'>
        <h2 className='text-3xl'>Welcome Back</h2>
        <div className='w-full flex flex-col items-center justify-center mt-10'>
          <AuthInput value={email} onChange={(e) => setEmail(e.target.value)} label={"Email"} placeholder={"Enter Email"} type={"email"} />
          <p className='text-red-500 text-sm text-start mt-2'>{emailError}</p>
          <AuthInput value={password} onChange={(e) => setPassword(e.target.value)} className={"mt-5"} label={"Password"} placeholder={"Enter Password"} type={"password"} />
          <p className='text-red-500 text-sm text-start mt-2'>{passwordError}</p>
        </div>
        <div className='mt-10'>
          <PrimaryBtn text={"Login"} onClick={login} disabled={loader ? true : false} loading={loader ? true : false} />
        </div>
        {authError}
        <p className='mt-5'>Don't have an account? <span className='text-amber-500 underline cursor-pointer' onClick={() => navigate('/sign-up')}>Sign Up</span></p>
      </div>
    </div>
  )
}

export default Login