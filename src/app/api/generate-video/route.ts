import { NextResponse } from "next/server";
import {Movie,Scene} from "json2video-sdk"

export const POST = async (req:Request,res:NextResponse) => {

    try{

        const {sceneElements,audioUrl} = await req.json()

        let movie = new Movie

        movie.setAPIKey(process.env.JSON_2_VIDEO_API_KEY);

        if(!movie)
        {
            return new NextResponse("JSON2 VIDEO KEY HAVE NOT FOUND")
        }


        movie.set("quality","high")

        // Generate a video draft 
        movie.set("draft", true);

        
        // Create a new scene
        let scene = new Scene;

        // Set the scene background color
        scene.set("background-color",  "#529261");

        // Add a text element printing "Hello world" in a fancy way (style 003)
        // The element is 10 seconds long and starts 2 seconds from the scene start
        // scene.addElement({
        //     type: "text",
        //     style: "005",
        //     text: content,
        //     duration: videoDuration,
        //     start: 0,
            
            
        // });

        sceneElements.forEach((element: any) => {
            scene.addElement({
                type: element.type,
                style: element.style,
                text: element.text,
                duration: element.duration,
                start: element.start,
            });
        });

    

        scene.addElement({
            type: "audio",
            "src": audioUrl,
	        "start": 0
        });

        // Add the scene to the movie
        movie.addScene(scene);

        // Call the API and render the movie
        let render = await movie.render();
        console.log(render);

        let videoUrl = ""

        await movie
            .waitToFinish((status: any) => {
                console.log("Rendering: ", status.movie.status, " / ", status.movie.message);
            })
            .then((status: any) => {
                console.log("Response: ", status);
                console.log("Movie is ready: ", status.movie.url);

                videoUrl = status.movie.url
            })
            .catch((err: any) => {
                console.log("Error: ", err);
            });
    


        return NextResponse.json({resultUrl: videoUrl},{status: 200})

    }catch(error)
    {
        console.log("Vidoe Creation Error -> ",error)

        return new NextResponse("Internal Error",{status: 500})
    }

}