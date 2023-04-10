const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb://0.0.0.0:27017/DocuShare")

const io = require('socket.io')(3001,{
    cors: {
        origin : 'http://localhost:3000',
        methods : ['GET','POST']
    }
})

const defaultValue = ""

io.on("connection", socket => {
    socket.on("get-document", async(documentID) => {
        const document = await findOrCreateDoc(documentID)
        socket.join(documentID)
        socket.emit("load-document", document.data)
        console.log(document.data)
        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentID).emit("receive-changes", delta)
        })
        socket.on("save-document", async data =>{
            await Document.findByIdAndUpdate(documentID, {data})
        })
    })
    console.log("CONNECTED");
})

async function findOrCreateDoc(id){
    if(id == null) return 
    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({_id : id, data : defaultValue})
}
