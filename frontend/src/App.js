import TextEditor from "./textEditor";
import LoginPage from "./loginPage";
import HomePage from "./homePage"
import RegisterPage from "./registerPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, 
} from 'react-router-dom'

import {useEffect, useState} from "react"

import axios from "axios"

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);    
  // axios.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
  // axios.defaults.headers.common['Access-Control-Allow-Methods'] = "GET,PUT,POST,DELETE,PATCH,OPTIONS";

  useEffect(()=>{
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsAuthenticated(true);
    }
    else {
      setIsAuthenticated(false);
    }
  })

  function handleLogin(token) {
    console.log(token)
    axios.defaults.headers.common['Authorization'] = token;
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    console.log(isAuthenticated)
  }

  function handleLogout() {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    console.log(isAuthenticated)
  }

  return (
  <Router>
     <Routes>
          <Route path="/login" exact element = {isAuthenticated ? (<Navigate to={'/home'}/>) : (<LoginPage onLogin={handleLogin}/>)}/>
          <Route path="/register" exact element = {isAuthenticated ? (<Navigate to={'/home'}/>) : (<RegisterPage/>)}/>
          {/* <Route path="/home" exact element = {<HomePage/>}/> */}
          {/* <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`}/>}/> */}
          <Route path="/document" exact element = {isAuthenticated ? <TextEditor/> : (<Navigate to={'/login'}/>)}/>
          <Route path="/home" exact element = {isAuthenticated ? (<HomePage onLogout={handleLogout}/>) : (<Navigate to={'/login'}/>)}/>
          <Route path="/" exact element = {isAuthenticated ? (<HomePage onLogout={handleLogout}/>) : (<Navigate to={'/login'}/>)}/>
          {/* <Route path="/home" exact element = {isAuthenticated ? (<HomePage/>) : (<Navigate to={'/login'}/>)}/> */}
      </Routes>
  </Router>
  );
}

export default App;
