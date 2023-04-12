import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import "./styles/loginPage.css"
import axios from "axios"
export default function RegisterPage() {
    useEffect(()=>{
            // 👇 add class to body element
        document.body.classList.add('login-body');
    })

    const nav = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = { email, password, name };
      axios.post('http://localhost:3002/register', data)
      .then(response => {
        if(response.data.message === 'User registered successfully'){
          nav('/login');
        } 
        else{
          setError(response.data.message);
        } 
      })
      .catch(error => {
        console.log(error);
      });
    }
  
    return (
      <div>
        <nav className="login-top-nav-bar">
          <ul>
              <li><a href="/home">DocuShare</a></li>
          </ul>
        </nav>
        <div className="login-center">
          <h1>Register</h1>
          <form onSubmit={handleSubmit} method="post">
            <div className="txt_field">
              <input type="text" onChange={(e) => setEmail(e.target.value)} required/>
              <span></span>
              <label>Email</label>
            </div>
            <div className="txt_field">
              <input type="text" onChange={(e) => setName(e.target.value)} required/>
              <span></span>
              <label>Name</label>
            </div>
            <div className="txt_field">
              <input type="password" onChange={(e) => setPassword(e.target.value)} required/>
              <span></span>
              <label>Password</label>
            </div>
            <p>{error}</p>
            <input type="submit" value="Register"/>
            <div className="signup_link">
              Already a member? <a href="/login">Login</a>
            </div>
          </form>
        </div>
      </div>
    );
}
