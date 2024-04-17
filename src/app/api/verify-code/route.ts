import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {status: 500}
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Verification Successful",
                },
                {status: 500}
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification Code expired! please signup again"
                },
                {status: 500}
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification Code"
                },
                {status: 500}
            )
        }

    } catch (error) {
        console.log("Error Verifying User: ", error);
        return Response.json(
            {
                success: false,
                message: "Error Verifying User"
            },
            {status: 500}
        )
    }
}
