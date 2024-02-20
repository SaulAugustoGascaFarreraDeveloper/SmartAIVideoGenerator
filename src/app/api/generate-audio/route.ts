import { NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary';
import * as mm from "music-metadata"
import OpenAI from "openai";
import { v4 as uuidv4 } from 'uuid'

const configuration = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const POST = async (req:Request,res:NextResponse) => {

    try{

        

        if(!configuration || !cloudinaryConfig) return new NextResponse("Unauthorized",{status: 401})
    

        const {promptResult,voiceValue,speedVoice} = await req.json()

        const audio = await configuration.audio.speech.create({
            model: "tts-1",
            voice: voiceValue,
            speed: speedVoice,
            response_format: "mp3",
            input: promptResult
        })

        interface CloudinaryResponse {
            public_id: string;
            version: number;
            signature: string;
            width: number;
            height: number;
            format: string;
            resource_type: string;
            created_at: string;
            tags: string[];
            bytes: number;
            type: string;
            etag: string;
            placeholder: boolean;
            url: string;
            secure_url: string;
            original_filename: string;
        }

        const buffer = Buffer.from(await audio.arrayBuffer())

        const track = await mm.parseBuffer(buffer)

        const durationInSeconds = track.format.duration

        const cloudinaryResponse = await new Promise<CloudinaryResponse>((resolve,reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: "auto",
                public_id: uuidv4(),
                format: 'mp3'
                
            },(error,result) => {

                if(error) reject(error)
                else{
                    resolve(result as CloudinaryResponse)
                }

            }).end(buffer)
        })

        //console.log(cloudinaryResponse)

        const uploadedFileUrl = cloudinaryResponse.secure_url

        return NextResponse.json({duration: durationInSeconds,resultUrl: uploadedFileUrl},{status: 200})

        //return NextResponse.json({promptResult,voiceValue,speedVoice})

    }catch(error)
    {
        console.log("Generate Audio Error --> ",error)
        return  NextResponse.json({message: error},{status: 500})
    }

}