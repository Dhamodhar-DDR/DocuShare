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
  function check_auth(){
    const authToken = localStorage.getItem('authToken');
    if (authToken) return true;
    else return false;
  }
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
    axios.defaults.headers.common['Authorization'] = token;
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  }

  function handleLogout() {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  }

  return (
  <Router>
     <Routes>
          <Route path="/login" exact element = {check_auth() ? (<Navigate to={'/home'}/>) : (<LoginPage onLogin={handleLogin}/>)}/>
          <Route path="/register" exact element = {check_auth() ? (<Navigate to={'/home'}/>) : (<RegisterPage/>)}/>
          {/* <Route path="/home" exact element = {<HomePage/>}/> */}
          {/* <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`}/>}/> */}
          <Route path="/document" exact element = {check_auth() ? <TextEditor/> : (<Navigate to={'/login'}/>)}/>
          <Route path="/home" exact element = {check_auth() ? (<HomePage onLogout={handleLogout}/>) : (<Navigate to={'/login'}/>)}/>
          <Route path="/" exact element = {check_auth() ? (<HomePage onLogout={handleLogout}/>) : (<Navigate to={'/login'}/>)}/>
          {/* <Route path="/home" exact element = {isAuthenticated ? (<HomePage/>) : (<Navigate to={'/login'}/>)}/> */}
      </Routes>
  </Router>
  );
}

export default App;
