import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(AuthOptions);
    const user: User = session?.user as User;

    if (!session || !session?.user) {
        return Response.json({
            message: "Not Authenticated",
            success: false
        }, {status: 401})
    }

    const userId = user._id;

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if (!updatedUser) {
            return Response.json({
                message: "failed to update user status to accept messages",
                success: false
            }, {status: 401})
        }

        return Response.json({
            message: "Message Acceptance Status Updated Successfully",
            success: true
        }, {status: 200})
    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json({
            message: "Failed to update user status to accept messages",
            success: false
        }, {status: 500})
    }

}

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

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
    
        if (!foundUser) {
            return Response.json({
                message: "User not found",
                success: false
            }, {status: 404})
        }
    
        return Response.json({
            message: "Fetched Message Status",
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, {status: 200})

    } catch (error) {
        console.log("Failed to fetch user status to accept messages");
        return Response.json({
            message: "Failed to fetch user status to accept messages",
            success: false
        }, {status: 500})
    }
}

