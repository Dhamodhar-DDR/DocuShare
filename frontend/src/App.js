import TextEditor from "./textEditor";
import LoginPage from "./loginPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate 
} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'

function App() {
  return (
  <Router>
     <Routes>
          <Route path="/login" exact element = {<LoginPage/>}/>
          <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`}/>}/>
          <Route path="/documents/:id" element = {<TextEditor/>}/>
      </Routes>
  </Router>
  );
}

export default App;
