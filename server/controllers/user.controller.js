import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Chat from "../models/chat.model.js";
import { ObjectId } from "mongodb";

const getUserProfile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // const id = req.user._id;
  // if (userId !== id.toString()) {
  //   throw new ApiError(401, "Authorize first");
  // }
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(500, "Something went wrong while accessing database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});
/*Connection Actions*/
const connectToUser = asyncHandler(async (req, res) => {
  const receiver = req.params.id;
  const sender = req.user._id;

  console.log("Connect to user from this is ......");
  // self connection request
  if (receiver === sender.toString()) {
    throw new ApiError(401, "Operation is not possible");
  }

  const connections = await Connection.findOne({
    $or: [
      {
        sender: receiver,
        receiver: sender,
      },
      {
        sender,
        receiver,
      },
    ],
  });
  console.log(connections);
  if (connections) {
    return res
      .status(200)
      .json(new ApiResponse(200, connections, "Already sent request"));
  }
  const response = await Connection.create({
    receiver,
    sender,
  });

  if (!response) {
    throw new ApiError(
      500,
      "Something went wrong while sending connection request"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Request sent Successfully!!!"));
});

const UserRequests = asyncHandler(async (req, res) => {
  console.log("Hello from this side");
  const id = req.user._id.toString();
  // const id = req.params.id;

  console.log("heelo", id);
  // if (id !== userId.toString()) {
  //   throw new ApiError(401, "Authorized first");
  // }

  const requests = await Connection.find({ receiver: id, status: "Pending" });

  console.log(requests);
  if (!requests) {
    throw new ApiError(500, "Something went wrong while working with database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Fetched all requests successfully"));
});

const acceptUserRequest = asyncHandler(async (req, res) => {
  const reqId = req.params.requestId;
  console.log(reqId);
  const request = await Connection.findById(reqId);
  console.log(request);
  if (!request) {
    throw new ApiError(404, "No such request connection exist");
  }

  const accept = await Connection.findByIdAndUpdate(
    reqId,
    {
      $set: {
        status: "Accepted",
      },
    },
    {
      new: true,
    }
  );

  if (!accept || accept.status !== "Accepted") {
    throw new ApiError(
      500,
      "Something went wrong while updating connection status"
    );
  }

  const friend1 = await User.findById(accept.receiver);
  const friend2 = await User.findById(accept.sender);

  if (!friend1 || !friend2) {
    throw new ApiError(404, "User is not found may be deleted account");
  }

  friend1.connections.push(friend2._id);
  friend2.connections.push(friend1._id);
  await friend1.save();
  await friend2.save();
  // friend1.save(done);

  return res
    .status(200)
    .json(new ApiResponse(200, accept, "Connection accepted successfully"));
});

const getAllConnections = asyncHandler(async (req, res) => {
  const id = req.params.userId;
  // const loggedInUser = req.user._id;

  // console.log(userId, loggedInUser.toString( ));
  // if(userId !== loggedInUser.toString()){
  //     throw new ApiError(400, "Athorized first");
  // }

  // const connections = await Connection.find({ _id: userId, status: "Accepted"});
  // const connections = await Connection.find({
  //   $and: [
  //     {
  //       $or: [{ sender: userId }, { receiver: userId }],
  //     },
  //     {
  //       status: "Accepted",
  //     },
  //   ],
  // });
  const user = await User.findById(id);

  const friends = await Promise.all(
    user.connections.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, firstName, lastName, occupation, location, profileImg }) => {
      return { _id, firstName, lastName, occupation, location, profileImg };
    }
  );
  // res.status(200).json(formattedFriends);
  console.log(friends, "get all connections...");
  if (!friends) {
    throw new ApiError(500, "Something went wrong while getting connections");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, friends, "Connection list fetched"));
});

const removeConnection = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const connectionId = req.params.connectionId;
  const userId = req.user._id.toString();

  // console.log(id, connectionId, userId);
  if (id !== userId) {
    throw new ApiError(401, "Authenticate first");
  }

  const resp = await Connection.findByIdAndDelete(connectionId);
  console.log(resp);
  const friend1 = await User.findById(resp.sender);
  const friend2 = await User.findById(resp.receiver);

  friend1.connections = friend1.connections.filter(
    (connectionId) => connectionId.toString() !== friend2._id.toString()
  );

  // Remove friend1's ID from friend2's connections
  friend2.connections = friend2.connections.filter(
    (connectionId) => connectionId.toString() !== friend1._id.toString()
  );

  // Save the updated friends to the database
  await friend1.save();
  await friend2.save();
  if (!resp) {
    throw new ApiError(500, "Something went wrong while working with database");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, resp, "Connection removed successfully"));
});
const getImageUrl = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const id = req.user._id;

  const connection = await Connection.find({
    $or: [
      {
        $and: [{ sender: userId }, { receiver: id }],
      },
      {
        $and: [{ sender: id }, { receiver: userId }],
      },
    ],
  });

  if (!connection) {
    throw new ApiError(401, "Make connection first....");
  }

  const friend = await User.findById(userId);

  if (!friend) {
    throw new ApiError(404, "User is removed or doesn't exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, friend.profileImg, "Image url fetched successfully")
    );
});

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

const requestStatus = asyncHandler(async (req, res) => {
  const userId = new ObjectId(req.params.userId);
  const id = req.user._id;
  console.log("hello from req status", userId, id);
  const connections = await Connection.find({
    $or: [
      { sender: userId, receiver: id },
      { sender: id, receiver: userId },
    ],
  });
  console.log(connections);
  if (!connections) {
    throw new ApiError(500, "Something went wrong while accessing database");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, connections[0], "connections fetched successfully!!")
    );
});
export {
  getUserProfile,
  connectToUser,
  UserRequests,
  acceptUserRequest,
  getAllConnections,
  removeConnection,
  getImageUrl,
  allUsers,
  requestStatus,
};
