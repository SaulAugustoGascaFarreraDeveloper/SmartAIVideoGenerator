"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useMemo, useState,useCallback } from 'react'

const GenerateVideoPage = () => {

    const [videoAudio,setVideoAudio] = useState<string>("")
    const [videoDuration,setVideoDuration] = useState<number>(0)
    const [content,setContent] = useState<string>("")
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const [resultUrl,setResultUrl] = useState<string>("")

    const audioDuration = localStorage.getItem("audioDuration")
    const audioUrl = localStorage.getItem("audioUrl")
    const summarizeContent = localStorage.getItem("summarize")

    const [minutesReadTime,setMinutesReadTime] = useState<number>(0)
    const [timeDividedPerFor,setTimeDividedPerFour] = useState<number>(0)


    const [contentForFifteenSeconds,setContentForFifteenSeconds] = useState<string>("")
    const [sceneElements, setSceneElements] = useState<any[]>([]);


    const words = useMemo(() => content.split(/\s+/).length,[content])

    

    const readTimeInMinutes = Math.ceil(words / 200)

    let endpoint = ""
    

    useEffect(() => {

        //console.log(readTimeInMinutes)


        if(audioDuration && audioUrl && summarizeContent)
        {
            setVideoAudio(audioUrl)
            setVideoDuration(parseFloat(audioDuration))
            const contentArray = JSON.parse(summarizeContent);
            let contentWithoutQuotes = contentArray.join(" ");
            setContent(contentWithoutQuotes)

            //console.log(content)


            const wordsPerElement = Math.ceil(words / 4)

            const numberOfElements = 4
            const audioDurationInSeconds = parseFloat(audioDuration)
            const elementDuration = audioDurationInSeconds / numberOfElements

            const elements: any[] = []

            for(let i=0;i < 4;i++)
            {
                const start = i * wordsPerElement
                const end = start + wordsPerElement

                const text = content.split(/\s+/).slice(start,end).join(' ')

                const newElement = {
                    type: "text",
                    style: "005",
                    text: text,
                    duration: videoDuration / 4,
                    start: i * (videoDuration / 4),
                };

                elements.push(newElement)
            }

            setSceneElements(elements);
           

            const timeDividedByFour = readTimeInMinutes * 60 / 4

            console.log(timeDividedByFour)

            setMinutesReadTime(readTimeInMinutes)
            setTimeDividedPerFour(videoDuration / 4)

        }

    },[audioDuration,audioUrl,summarizeContent,content])


    const handleGenerateVideo = async () => {

        setIsLoading(true)

        try{

            endpoint = "/api/generate-video"

            const response = await axios.post(endpoint,{sceneElements: sceneElements,audioUrl: videoAudio})

            //console.log(response.data)


            setResultUrl(response.data.resultUrl)

            return response.data

        }catch(error)
        {
            console.log(error)

        }finally{
            setIsLoading(false)
        }

    }


    const renderSceneElements = useCallback(() => {
        return sceneElements.map((element, index) => (
            <div key={index}>
                <p>Elemento {index + 1}</p>
                <p>Type: {element.type}</p>
                <p>Style: {element.style}</p>
                <p>Text: {element.text}</p>
                <p>Duration: {element.duration}</p>
                <p>Start: {element.start}</p>
            </div>
        ));
    },[sceneElements])

  return (
    <div className='flex flex-col items-center mt-2 w-full gap-3'>
        {videoAudio && <p className='font-semibold'>AUDIO URL: {videoAudio}</p>}
        {videoDuration && <p className='font-semibold'>AUDIO Duration: {videoDuration}</p>}
        <p>Este contenido tiene aproximadamente {words} palabras.</p>
        <p>Se estima que tomará alrededor de {readTimeInMinutes} minutos para leerlo.</p>
        <p>Si lo divides en cuatro partes, cada parte tomará aproximadamente {timeDividedPerFor} segundos.</p>
        <p>Contenido para aproximadamente 15 segundos de lectura: {contentForFifteenSeconds}</p>
        <div>
                <p>Elementos de escena generados:</p>
                {renderSceneElements()}
            </div>

            <div>
            <Button disabled={isLoading} onClick={handleGenerateVideo} className='border-2 border-black' >
                        Crear Video
            </Button>
            </div>

            {resultUrl && <p className='font-extrabold '>{resultUrl}</p>}
    </div>
  )
}

export default GenerateVideoPage