import {React,useEffect} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"

export default function TextEditor() {
    useEffect(()=>{
        new Quill("#main-editor", {theme:"snow"})
    },[])
    return (
        <div id="main-editor"></div>
    )
}
