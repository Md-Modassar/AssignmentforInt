const exprees=require('express');
const mongoose=require('mongoose');
const router=require('./Route/Route')
const app=exprees();
const multer=require('multer');

app.use(exprees.json());
app.use(multer().any());

mongoose.connect('mongodb+srv://modassar123:modassar1234@test.ahxnnau.mongodb.net/assignment',{
    useNewUrlParser:true
},mongoose.set('strictQuery',false))
.then(()=>console.log("mongoDB is connected"))
.catch((error)=>console.log(error))

app.use('/',router)

app.listen(3001,()=>{
    console.log('server is running on 3001')
})