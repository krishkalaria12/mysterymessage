import UserModel from "@/model/User";
import { Message } from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({username})

        if (!user) {
            return Response.json({
                message: "User not found",
                success: false
            }, {status: 404})
        }

        if(!user.isAcceptingMessage) {
            return Response.json({
                message: "User not accepting messages",
                success: false
            }, {status: 403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({
            message: "Message Sent Successfully",
            success: true
        }, {status: 200})
    } catch (error) {
        console.log("Error Adding Messages", error);
        return Response.json({
            message: "Error Adding Messages",
            success: false
        }, {status: 500})
    }
}