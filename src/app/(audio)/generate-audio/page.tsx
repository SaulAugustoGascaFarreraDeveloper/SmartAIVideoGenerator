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

    // setPromptResult(`El proyecto se centra en ayudar a la empresa "Servicios Industriales AG S.A DE C.V" a consolidarse en el mercado de servicios industriales de forma innovadora. Se busca ofrecer un servicio de extracción de escoria de aluminio para reciclado de materiales, que no es común en el estado de Zacatecas y sus alrededores. El objetivo es atraer la atención de otras empresas manufactureras e industriales que actualmente no están vinculadas con esta empresa. El proyecto incluye la propuesta de un proceso y la cotización de la adquisición de equipos para el servicio de recuperación de aluminio.

    // El servicio de extracción de escoria de aluminio para reciclado de materiales ofrecido por la empresa consiste en la búsqueda de medios de contacto para la adquisición de equipo y maquinaria necesarios para realizar el proceso de extracción de aluminio a partir de la escoria o residuos de aluminio. Además, buscan una ubicación de terreno o propiedad donde instalar el equipo para llevar a cabo el proceso de recuperación de aluminio.
    
    // La importancia de la extracción de escoria de aluminio para el reciclado de materiales radica en que, al procesar el aluminio secundario a partir de la escoria, se puede llevar a cabo sin pérdida de calidad del producto final. Además, en comparación con la producción de aluminio primario, el proceso de reciclaje consume del 5% al 20% de la energía necesaria en el proceso de producción primaria, lo que lo hace más eficiente y sostenible. Reciclar la escoria de aluminio contribuye a la conservación de recursos, reduce el consumo de energía y disminuye la necesidad de extraer nuevos materiales, lo cual es beneficioso para el medio ambiente y para la economía.`)

    
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

      {url && duration && <div className='flex flex-col gap-3 items-center'> 
        
        <Link href={'/generate-video'}>
        
        <Button >
          Generar Video 
        </Button>
      
      </Link>

      <Link href={url} >
        <p className='font-bold' >{url}</p>
      </Link>
      
      </div>}

     
    </div>
  )
}

export default GenerateAudio