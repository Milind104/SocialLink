import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import  ApiResponse from "../utils/ApiResponse.js";
import Chat from "../models/chat.model.js";

/*Connection Actions*/
const connectToUser = asyncHandler( async(req, res) =>{
    const receiver = req.params.id;
    const sender = req.user._id;

    // console.log(receiver, sender.toString());
    // self connection request
    if(receiver === sender.toString()){
        throw new ApiError(401, "Operation is not possible");
    }

    const response = await Connection.create({
        receiver,
        sender
    });

    if(!response){
        throw new ApiError(500, "Something went wrong while sending connection request");
    }

    return res.status(200)
    .json(new ApiResponse(200,response, "Request sent Successfully!!!"));
})

const UserRequests = asyncHandler( async(req, res) =>{
    const userId = req.user._id;
    const id = req.params.id;
    
    // console.log(id, userId.toString());
    if(id !== userId.toString()){
        throw new ApiError(401, "Authorized first");
    }

    const requests = await Connection.find({receiver: id, status: "Pending"});

    if(!requests){
        throw new ApiError(500, "Something went wrong while working with database");
    }

    return res.status(200)
    .json(new ApiResponse(200, requests, "Fetched all requests successfully"));
})

const acceptUserRequest = asyncHandler( async(req, res) =>{
    const reqId = req.params.requestId;

    const request = await Connection.findById(reqId);

    if(!request){   
        throw new ApiError(404, "No such request connection exist");
    }

    const accept = await Connection.findByIdAndUpdate(
        reqId,
        {
            $set: {
                status: "Accepted"
            }
        },
        {
            new : true
        }
    )

    if(!accept || accept.status !== "Accepted"){
        throw new ApiError(500, "Something went wrong while updating connection status");
    }

    return res.status(200)
    .json(new ApiResponse(200, accept, "Connection accepted successfully"));
})

const getAllConnections = asyncHandler( async(req, res) =>{
    const userId = req.params.userId;
    const loggedInUser = req.user._id;

    // console.log(userId, loggedInUser.toString( ));
    if(userId !== loggedInUser.toString()){
        throw new ApiError(400, "Athorized first");
    }

    // const connections = await Connection.find({ _id: userId, status: "Accepted"});
    const connections = await Connection.find({ 
        $and: [
            {
                $or: [
                    {sender: userId},
                    {receiver: userId}
                ]
            },
            {
                status: "Accepted"
            }
        ]
    });

    if(!connections){
        throw new ApiError(500, "Something went wrong while getting connections");
    }

    return res.status(200)
    .json(new ApiResponse(200, connections, "Connection list fetched"));

})

const removeConnection = asyncHandler( async(req,  res) =>{
    const id = req.params.id;
    const connectionId = req.params.connectionId;
    const userId = (req.user._id).toString();
    
    // console.log(id, connectionId, userId);
    if(id !== userId){
        throw new ApiError(401, "Authenticate first");
    }

    const resp = await Connection.findByIdAndDelete(connectionId);
    // const resp = await Connection.findOneAndDelete({
    //     $or: [
    //         {
    //             $and: [
    //                 {sender: id},
    //                 {receiver: userId}
    //             ]
    //         },
    //         {    $and: [
    //                 {sender: userId},
    //                 {receiver: id},
    //             ]
    //         }
    //     ]
    // })

    if(!resp){
        throw new ApiError(500, "Something went wrong while working with database");
    }

    return res.status(200)
    .json(new ApiResponse(200,resp, "Connection removed successfully"));
})


export {
    connectToUser,
    UserRequests,
    acceptUserRequest,
    getAllConnections,
    removeConnection,
}

