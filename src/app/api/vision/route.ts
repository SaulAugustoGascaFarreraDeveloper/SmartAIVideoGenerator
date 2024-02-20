import { NextResponse } from "next/server";

export const GET = async (req:Request,res:NextResponse) => {

    try{

        return NextResponse.json({result: "OPEN AI VISION"},{status: 200})

    }catch(error)
    {
        console.log(error)
    }

}