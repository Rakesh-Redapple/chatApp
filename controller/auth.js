const User=require('../models/User');
const {StatusCodes}=require('http-status-codes');
//const jwt=require('jsonwebtoken');
//const bcrypt= require('bcryptjs');



const registration= async(req,res)=>{
    try{
const {name,email,password}=req.body;
//const salt= await bcrypt.genSalt(10);
//const hashPassword=await bcrypt.hash(password,salt);
//const tempUser={name,email,password:hashPassword}
if(!name || !email || !password){
    return res.status(400).json({Status:"false",message:'please insert name email and password'});
}
        const user= await User.create({...req.body})
        //const token=await jwt.sign({userId:user._id,name:user.name},process.env.JWTKEY,{expiresIn:'30d'});
        const token=user.createJwt();
        res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
    }catch(error){
        console.log('error h');
       return res.status(StatusCodes.BAD_REQUEST).json({Error:error.message});
    }
   
}

const login= async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(StatusCodes.BAD_REQUEST).json({Status:'false',msg:'please insert email and password'})
        }
        const user= await User.findOne({email});
        console.log(user);
        // Compare password
        if(!user){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'user does not exit'});
        }
        const isPasswordCorrect= await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(StatusCodes.OK).json({msg:'invalid credintial'});
        }
        const token= user.createJwt();
        res.status(StatusCodes.OK).json({user:{name:user.name},token});
    }catch(error){
        console.log(error);
    }
}






module.exports={registration,login}