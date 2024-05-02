import express from "express";
import {postCompany,loginCompany,getAllComapines,getMyCompany,updateCompany,deleteCompany,updatePassword} from '../Controller/CompanyController';
import {verifyJWT as fetchuser } from '../middleware/auth.middleware';
import encryption from '../middleware/hasing.middleware';
const companyRouter = express.Router();


companyRouter.route('/signup')
.post(encryption,postCompany);    // company signup

companyRouter.route('/login')
.post(loginCompany);    // company login

companyRouter.route('')
.get(fetchuser,getMyCompany);  //get all compaines details

companyRouter.route('/password')
.put(fetchuser,encryption,updatePassword);

companyRouter.route('/:id')
.delete(fetchuser,deleteCompany)
.put(updateCompany);

export default companyRouter;