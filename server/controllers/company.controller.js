import CompanyModel from "../models/company.model";
import bcrypt from "bcrypt";
import {verifyJwt as authtokenfun} from "../middleware/auth.middleware"


//route 1 : To register Company 'company/signup'
module.exports.postCompany = async function postCompany (req,res){
    let data = req.body;
    try{

    let resp = await CompanyModel.create({
        Name:data.Name,
        Address:data.Address,
        Email:data.Email,
        Password :data.Password,
    })
    console.log(resp);
    
    const authtoken =  authtokenfun(resp);

    if(resp){
        // localStorage.setItem('CompanyId',result._id.valueOf());
    res.status(200).json({success:true,message:"Successfully Registered",authtoken});
    }
    else{
        res.status(400).json({success:false,message:"Email is already Registered"}); 
    }

    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

//route 2 : To login Company 'company/login'

module.exports.loginCompany = async function loginCompany(req,res){
    let data = req.body;
    try{
    let result = await CompanyModel.findOne({Email:data.Email});
    // console.log(result.Password,data.password);
    if(result){
    const passwordCompare= await bcrypt.compare(data.Password,result.Password);
        if(passwordCompare){
            
            const authtoken =  authtokenfun(result);

            // localStorage.setItem('CompanyId',result._id.valueOf());
            res.status(200).json({success:true,message : "Successfully Logged in",authtoken});
        }
        else{
            res.status(401).json({success:false,message : "Password dosen't match"});
        }
    }
    else{
        res.status(404).json({success:false,message:"Email is not registered"});
    }

    }catch(error){
        console.log(error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

//route 3 : To get all companies 
module.exports.getAllComapines = async function getAllComapines(req,res){
    try{
    let data = await CompanyModel.find();
    console.log(data);
    res.stutus(200).json({success:false,message:"It's working properly"});

    }catch(error){
        console.log(error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
//route 4 : To register Company 'company/signup'

module.exports.getMyCompany = async function getMyCompany(req,res){
    let user = req.user.id
    console.log(user);
    try{
    let data = await CompanyModel.findById(user);
    console.log(data);
    res.status(200).json({success:true,data});

    }catch(error){
        console.log(error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
module.exports.deleteCompany = async function deleteCompany (req,res){
    let id = req.params.id;
    let user = req.user.id;
    // let result = await StudentModel.findOneAndRemove({email:data.Email});
    // res.json({suceess:true,result,message:"User deleted successfully!!!"});
    try{
        let response = await CompanyModel.findById(id);
        if(!response){
            res.status(404).json({success:false,message:"Not Found"});
        }
        console.log("this is my profile",response,response.id.toString());
        if(response.id.toString()!=user){
            res.status(401).json({success:false,message:"Not Allowed To Perfrom this Action"});
        }
        let resp = await CompanyModel.findByIdAndDelete(id);
        if(resp){
            res.status(200).json({success:true,message:"Deleted Successfully"});
        }
    }
    catch(error){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

module.exports.updateCompany = async function updateCompany(req,res){
    let id = req.params.id;
    let {Name,Address,Email} = req.body;
    try{
        let resp = await CompanyModel.findById(id);
        if(!resp){
            res.status(404).json({success:false,message:"Not Found"});
        }
        let newData = {Name,Address,Email};
        if(resp){
            resp=await CompanyModel.findByIdAndUpdate(id,{$set:newData},{new:true});
            if(resp){
                res.status(200).json({success:true,message:"Successfully Updated",resp});
            }
            else{
                res.status(401).json({success:false,message:"Error"});
            }
        }
        else{
            res.status(404).json({success:false,message:"Student Not Found"});
        }
    }catch(error){
        console.log(error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}


module.exports.updatePassword = async function updatePassword(req,res){
    let id = req.user.id;
    let {oldPassword,Password} = req.body;
    console.log(oldPassword,Password,id);
    try{
        let resp = await CompanyModel.findById(id);
        if(!resp){
            res.status(404).json({success:false,message:"Not Found"});
        }
        const flag = await bcrypt.compare(oldPassword,resp.Password);
        
        let newData = {password:Password};
        if(flag){
       let response=await CompanyModel.findByIdAndUpdate(id,{$set:{"Password":Password}},{new:true});
            if(response){
                res.status(200).json({success:true,message:"Successfully Updated",response});
            }
            else{
                res.status(401).json({success:false,message:"Error"});
            }
        }
        else{
            res.status(400).json({success:false,message:"Password is Incorrect"});
            res.end();
        }
    }
    catch(error){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }   
}