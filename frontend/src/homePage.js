import React, {useState, useEffect} from 'react'
import "./styles/homePage.css" 
import {v4 as uuidV4} from 'uuid'
import { useSearchParams,createSearchParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HomePage({onLogout}) {
    const [files_list,setFiles] = useState([
        // { name: 'file1.txt', type: 'txt', size: '10KB' },
        // { name: 'file2.png', type: 'png', size: '5MB' },
        // { name: 'file3.pdf', type: 'pdf', size: '2MB' },
      ]) 
    const [searchQuery, setSearchQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [newDocName, setNewDocName] = useState('');
    const nav = useNavigate();

    const togglePopup = () => {
      setIsOpen(!isOpen);
    };
    
    useEffect(()=>{
        document.body.classList.add('home-body');
    })

    const filteredFiles = files_list.filter(file => {
        const regex = new RegExp(searchQuery, 'i');
        return regex.test(file.name);
      });

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    }
    const handleLogout=()=>{
        onLogout();
    }
    const handleCreateDoc = ()=>{
        const docId = uuidV4();
        nav({
            pathname: "/document",
            search: createSearchParams({
                docId: docId,
                docName : newDocName
            }).toString()
        });
    }

    const handleDocOpen = (id)=>{
        return(()=>nav({
            pathname: "/document",
            search: createSearchParams({
                docId: id
            }).toString()
        }));
        
    }

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('authToken');
        axios.get('http://localhost:3002/get_docs')
        .then(response => {
            var ls = []
            for(let i = 0;i<response.data.length;i++)
            {
                ls.push({name: response.data[i].name,id:response.data[i]._id,  type: 'txt', size: '10MB'});
            }
            setFiles(ls);
        })
        .catch(error => {
          console.log(error);
        });
    },[])
  
    return (
    <>
        <div className="user-files">
            <nav className="navbar">
            <div className="navbar-brand">DocuShare</div>
            <ul className="navbar-nav">
                <li className="nav-item">
                <button onClick={togglePopup}>Create</button>
                </li>
                <li className="nav-item">
                <button>Profile</button>
                </li>
                <li className="nav-item">                    
                <button onClick={handleLogout}>Logout</button>
                </li>
            </ul>
            </nav>
            <div className="file-list">
                <div className="search-bar">
                    <input type="text" placeholder="&#x1F50E;&#xFE0E; Search" onChange={handleSearch} />
                </div>
                {
                    files_list.length == 0 ? 
                    <div className="NoFiles">
                        <h2>No files</h2>
                        <button onClick={togglePopup}>
                            Create new document
                        </button>
                    </div> 
                    :<></>
                }
                {filteredFiles.map(file => (
                    <div className="file" onClick={handleDocOpen(file.id)} key={file.id}>
                        <div className="file-icon">
                            <i className={`fa fa-file-${file.type}`} />
                        </div>
                        <div className="file-details">
                            <div className="file-name">{file.name}</div>
                            <div className="file-size">{file.size}</div>
                        </div>  
                    </div>
                ))}
            </div>
        </div>
        
        <div className="upload-file-button">
            <div className="popup-container">
            <button className="add-btn" onClick={togglePopup}>+</button>
                {isOpen && (
                    <div className="popup">
                        <div className="popup-header">
                            <h3>Create a new document  </h3>
                            <button className="close-btn" onClick={togglePopup}>X</button>
                        </div>
                        <div className="popup-content">
                            {/* <label>Name: </label> */}
                            <input type="text" placeholder='Enter the document name' onChange={(e) => setNewDocName(e.target.value)} required/>
                            <button onClick={handleCreateDoc}> Create </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
    </>
      
    );
}

