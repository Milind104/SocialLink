import express from "express";
import {getJobs,postJob,deleteJob,getMyJobs} from '../Controller/JobController';
import {verifyJWT as fetchuser} from '../middleware/auth.middleware.js';
const JobRouter = express.Router();
JobRouter.route('')
.get(fetchuser,getJobs)
.post(fetchuser,postJob)

JobRouter.route('/myjobs')
.get(fetchuser,getMyJobs);

JobRouter.route('/:id')
.delete(fetchuser,deleteJob)

export default JobRouter;