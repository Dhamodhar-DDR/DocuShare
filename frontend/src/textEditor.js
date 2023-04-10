import {React,useCallback,useEffect, useRef, useState} from 'react'
import Quill from 'quill'
import {io} from "socket.io-client"
import { useParams } from 'react-router'

import "quill/dist/quill.snow.css"
import "./styles/textEditor.css"

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],  
]
const SAVE_INTERVAL_MS = 200
export default function TextEditor() {
    const {id: documentId} = useParams()
    const [socket,setSocket] = useState() 
    const [quill,setQuill] = useState() 
    
    useEffect(() => {
        if(socket == null || quill == null) return 
        const interval = setInterval(()=> {
            socket.emit('save-document', quill.getContents())
        }, SAVE_INTERVAL_MS)
        return () =>{
            clearInterval(interval) 
        }
        
    },[socket,quill])

    useEffect(() => {
        if(socket == null || quill == null) return 

        socket.once('load-document', document => {
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document',documentId) 
    },[socket,quill,documentId])

    useEffect(() => {
        const skt = io("http://localhost:3001")
        setSocket(skt);
        return () => {
            skt.disconnect();
        }
    },[])

    useEffect(() => {
        if(socket == null || quill == null) return 
        
        const handler = (delta,oldDelta,source) => {
            quill.updateContents(delta)
        }

        socket.on("receive-changes", handler)
        
        return () => {
            socket.off("receive-changes", handler)
        }
    }, [socket, quill])


    useEffect(() => {
        if(socket == null || quill == null) return 
        
        const handler = (delta,oldDelta,source) => {
            if(source != 'user') return
            socket.emit("send-changes", delta)
        }

        quill.on("text-change", handler)
        
        return () => {
            quill.off("text-change", handler)
        }
    }, [socket, quill])


    const wrapperRef = useCallback((wrapper)=>{
        if(wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement('div')
        wrapper.append(editor)
        const qll = new Quill(editor, {theme:"snow", modules : {toolbar : TOOLBAR_OPTIONS}})
        qll.disable()
        qll.setText("Loading...")
        setQuill(qll);
    },[])
    
    return (
        <div className="main-editor" ref={wrapperRef}>
        </div>
    )
}
