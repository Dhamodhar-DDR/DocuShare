const mongoose = require("mongoose")
const Document = require("./Document")
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors')
// const session = require('express-session');
const express = require('express');
const userController = require('./userController')

mongoose.connect("mongodb://0.0.0.0:27017/DocuShare")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


// Add middleware for handling sessions
// app.use(session({
//     secret: 'my-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     store: new MongoStore({ mongooseConnection: db })
//   }));
  
// Configure body parser for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add routes
app.use('/', routes);


app.listen(3002, () => {
    console.log('Server started on port 3002');
  });


const io = require('socket.io')(3001,{
    cors: {
        origin : 'http://localhost:3000',
        methods : ['GET','POST']
    }
})

const defaultValue = ""

io.on("connection", socket => {
    socket.on("get-document", async(documentID, token, name) => {
        userController.get_uid(token)
        .then(async(uid)=>{
            if(uid =='Unauthorized') return;
            const document = await findOrCreateDoc(documentID, uid, name)
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
        .catch(async(err)=>{console.log(err)})
    })
    console.log("CONNECTED");
})


async function findOrCreateDoc(documentID,uid, name){
    if(documentID == null) return 
    const document = await Document.findById(documentID)
    if(document) return document
    return await Document.create({_id: documentID, data : defaultValue, uid : uid, name : name, access : [uid]})
}
