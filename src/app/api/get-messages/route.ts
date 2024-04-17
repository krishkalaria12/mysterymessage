import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    const user: User = session?.user as User;

    if (!session || !session?.user) {
        return Response.json({
            message: "Not Authenticated",
            success: false
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            },
        ])

        if (!user || user.length==0) {
            return Response.json({
                message: "User not found",
                success: false
            }, {status: 401})
        }

        return Response.json({
            messages: user[0].messages,
            success: true
        }, {status: 401})
    } catch (error) {
        console.log("Unexpected Error Occurred: ", error);
        
        return Response.json({
            message: "Cannot get Messages",
            success: false
        }, {status: 500})
    }


}