const userModel=require('../Model/userModel')
const multer=require('multer');
const mongoose=require('mongoose');
const objectid=mongoose.Types.ObjectId
const jwt=require('jsonwebtoken')


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('Profile_picture');

exports.createUser=async(req,res)=>{
    try{
        const data=req.body;
        const {Name,Email,Mobile,Password}=data 
         
        data.Profile_picture=req.files[0].originalname;    
        if(!Name)
          {
            return res.status(400).send({status:false,message:"Please enter Name"})
          }
          if(!Email)
          {
            return res.status(400).send({status:false,message:"Please enter Email"})
          }
          if(!Mobile)
          {
            return res.status(400).send({status:false,message:"Please enter Mobile"})
          }
         
          if(!Password)
          {
            return res.status(400).send({status:false,message:"Please enter Password"})
          }

          if(!Name.match(/^[A-Za-z ][A-Za-z _]{1,100}$/))
            {
                return res.status(400).send({status:false,message:"Please enter Aa-Zz string"})
            }
          if(!Email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/))  
            {
              return res.status(400).send({status:false,message:"Enter valid email"})
            }
          if(!Mobile.match(/^[0-9]{10}$/))
           {
            return res.status(400).send({status:false,message:"Please enter valid mobile No"})
           }


        const emailuniq=await userModel.findOne({Email:Email})

        if(emailuniq)
        {
            return res.status(400).send({status:false,message:"Enter other email it already exist"})
        }

        const savedata=await userModel.create(data)

        return res.status(201).send({status:true,message:"create user successfull",savedata})


    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

exports.login=async(req,res)=>{
   try{
      const {Email,Password}=req.body 
      
      if(!Email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/))  
      {
        return res.status(400).send({status:false,message:"Enter valid email"})
      }

      const user=await userModel.findOne({Email:Email,Password:Password})

      if(!user)
        {
            return res.status(404).send({status:false,message:"email or password wrong"})
        }

        const token=jwt.sign({
            userid:user._id
        },"mdmodassar")

        return res.status(201).send({status:true,message:"token create successfully",token})


   }catch(err){
    return res.status(500).send({status:false,message:err.message})
   }
}
exports.updateUser=async(req,res)=>{
    try{
        const data=req.body;
        const {Name,Email,Mobile,Password}=data 
        const userid=req.params.userId
        console.log(userid)
        if(!objectid.isValid(userid))
          {
            return res.status(400).send({status:false,message:"Please enter valid userid"})
          }
        if( Name && !Name.match(/^[A-Za-z ][A-Za-z _]{1,100}$/))
        {
            return res.status(400).send({status:false,message:"Please enter Aa-Zz string"})
        }
      if(Email && !Email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/))  
        {
          return res.status(400).send({status:false,message:"Enter valid email"})
        }
      if(Mobile && !Mobile.match(/^[0-9]{10}$/))
       {
        return res.status(400).send({status:false,message:"Please enter valid mobile No"})
       }

       if(req.files.originalname)
       {
        data.Profile_picture=req.files.originalname
       }
      
       const updatedata=await userModel.findByIdAndUpdate(userid,data,{new:true})
       
       if(!updatedata)
         {
            return res.status(404).send({status:false,message:"User not found"})
         }

         return res.status(200).send({status:false,message:"update successfull",updatedata})

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

exports.deleteuser=async(req,res)=>{
    try{
         const userid=req.params.userId;

         if(!objectid.isValid(userid))
           {
            return res.status(400).send({status:false,message:"please enter valid userid"})
           }

           const deleteuser=await userModel.findByIdAndDelete(userid)
           if(!deleteuser)
             {
                return res.status(404).send({status:false,message:"user not found"})
             }

             return res.status(200).send({status:true,message:"user delete successfully"})
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

exports.getuser=async(req,res)=>{
    try{
       const userid=req.params.userId;
       if(!objectid.isValid(userid)){
        return res.status(400).send({status:false,message:"Please enter valid userid"})

       }
       const user=await userModel.findById(userid)

       if(!user)
         {
           return res.status(404).send({status:false,message:"user not found "})

         }
         return res.status(200).send({status:true,message:"successfull",user})
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}
exports.getusers=async(req,res)=>{
    try{
       
       const user=await userModel.find()
         return res.status(200).send({status:true,message:"successfull",user})
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}