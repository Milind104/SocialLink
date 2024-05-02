import mongoose from "mongoose";

const CompanySchema =  mongoose.Schema({
    Name:{
        type : String,
        required : true
    },
    Address:{
        type : String,
        required : true
    },
    Email:{
        type : String,
        required : true,
        unique : true
    },
    Password : {
        type : String,
        required : true
    }
})
const CompanyModel = mongoose.model('ComapanyModel',CompanySchema);
export default CompanyModel;