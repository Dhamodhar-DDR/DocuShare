import React, { useEffect, useState } from 'react'
import "./styles/loginPage.css"

export default function LoginPage() {
    useEffect(()=>{
            // 👇 add class to body element
        document.body.classList.add('login-body');
    })

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = { email, password };
    //   const res = await axios.post('/api/auth/login', data);
    //   localStorage.setItem('token', res.data.token);
    };
    return (
      <div>
        <nav className="login-top-nav-bar">
          <ul>
              <li><a href="/home">DocuShare</a></li>
          </ul>
        </nav>
        <div className="login-center">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} method="post">
            <div className="txt_field">
              <input type="text" onChange={(e) => setEmail(e.target.value)} required/>
              <span></span>
              <label>Email</label>
            </div>
            <div className="txt_field">
              <input type="password" onChange={(e) => setPassword(e.target.value)} required/>
              <span></span>
              <label>Password</label>
            </div>
            <div className="pass">Forgot Password?</div>
            <input type="submit" value="Login"/>
            <div className="signup_link">
              Not a member? <a href="#">Signup</a>
            </div>
          </form>
        </div>
      </div>
    );
}

//     <div className="login-center">
//       <h1>Login</h1>
//       <form method="post">
//         <div className="txt_field">
//           <input type="text" required>
//           <span></span>
//           <label>Username</label>
//         </div>
//         <div className="txt_field">
//           <input type="password" required>
//           <span></span>
//           <label>Password</label>
//         </div>
//         <div className="pass">Forgot Password?</div>
//         <input type="submit" value="Login">
//         <div className="signup_link">
//           Not a member? <a href="#">Signup</a>
//         </div>
//       </form>
//     </div>

