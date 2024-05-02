import JobModel from "../models/job.model";
import {user as StudentModel} from "../models/user.model";

module.exports.postJob = async function postJob(req,res){
    let data = req.body;
    let id = req.user.id;
    // let CompanyId = localStorage.getItem('CompanyId');
    console.log(data);
    if(id){
    let resp = await JobModel.create({
        Vacancy :  data.Vacancy,
        Criteria : data.Criteria,
        Description : data.Description,
        CompanyId : id,
        Package : data.Package,
        Position : data.Position
    })
    res.json({success : true,message : "Successfully Posted a Job"})
}
else{
    res.json({success:false,message:"Login first"});
}
}

module.exports.getMyJobs = async function getMyJobs(req,res){
    // let CompanyId = localStorage.getItem('CompanyId');
    if(req.user.id){
        let resp = await JobModel.find({CompanyId:req.user.id});
        res.send({success:true,resp});
    }
    else{
        res.json({success:false,message:"Login first"});
    }
}

module.exports.getJobs = async function getJobs(req,res){
    let id = req.user.id;
    console.log(id);
    let data = await StudentModel.findById(id);
    console.log(data);
    const resp = await JobModel.find({Criteria:{$lte:data.SPI}});
    if(resp){
        console.log(data);
        res.send({success:true,resp});
    }
    else{
        res.send({success:false,resp});
    }
}

module.exports.deleteJob = async function deleteJob(req,res){
    let CompanyId = req.user.id;
    try{
        console.log(req.params.id);
    let data = await JobModel.findById(req.params.id);
    if(!data){
        res.status(404).json("Not Found");
    }
    else{
        if(data.CompanyId.toString()==req.user.id){
            let resp = await JobModel.findByIdAndDelete(req.params.id);
            res.status(200).json({success:true,message:"Successfully Deleted"});
        }
        else{
            res.status(401).json({success:false,message:"Can't Perform this action"});
        }
    }
}
    catch(error){
        res.status(500).json("Internal Server Error");
    }
}