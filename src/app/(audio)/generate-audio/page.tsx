"use client"
import AIVoiceSpeedComboBox from '@/components/AIVoiceSpeedComboBox'
import AIVoicesComboxBox from '@/components/AIVoicesComboxBox'
import {useState,useEffect} from 'react'
import axios from "axios"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const GenerateAudio = () => {

  const [promptResult,setPromptResult] = useState<string>("")
  const [voiceValue,setVoiceValue] = useState<string>("")
  const [speedVoice,setSpeedVoice] = useState<number>(0)

  const [speed,setSpeed] = useState<number>(0)
  const [isValidOption,setIsValidOption] = useState<boolean>(false)

  const [duration,setDuration] = useState<number>(0)
  const [url,setUrl] = useState<string>("")

  const [isLoading,setIsLoading] = useState<boolean>(false)

  let endpoint = ""

  let summarizeContent = localStorage.getItem("summarize")

  useEffect(() => {



    if(summarizeContent)
    {
      console.log(summarizeContent)
      setPromptResult(summarizeContent)
    }
    
    // setVoiceValue("fable")
    // setSpeedVoice(1)

  },[summarizeContent])

  const generateAudioSubmit = async () => {

    setIsLoading(true)

      try{
        endpoint = "/api/generate-audio"
        const response = await axios.post(endpoint,{promptResult: promptResult ,voiceValue: voiceValue,speedVoice: speed})

        console.log(response.data)


        setUrl(response.data.resultUrl)

        setDuration(response.data.duration)

      

        return response.data

      }catch(error)
      {

          console.log(error)

      }finally{
        setIsLoading(false)

        //if(!url || !duration) return


      }

  }


    
  localStorage.setItem("audioUrl",url)
  localStorage.setItem("audioDuration",duration.toString())

  return (
    <div className='flex flex-col justify-center min-h-screen items-center gap-y-2'>
      {!isLoading && <> <AIVoiceSpeedComboBox setIsValidOption={setIsValidOption} setSpeed={setSpeed} speed={speed} /> 
      <AIVoicesComboxBox setIsValidOption={setIsValidOption} setVoiceValue={setVoiceValue} voiceValue={voiceValue}  /> </>}

      <Button disabled={isLoading || !isValidOption} onClick={generateAudioSubmit}>
        GENERAR  AUDIO
      </Button>

      {url && duration && <Link href={'/generate-video'}>
        
        <Button >
          Generar Video 
        </Button>
      
      </Link>}

     
    </div>
  )
}

export default GenerateAudio