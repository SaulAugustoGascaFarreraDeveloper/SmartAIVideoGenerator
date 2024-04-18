"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
 

const SummarizePage = () => {

  const [responses,setResponses] = useState<string[]>([])

 

  //let botResponses = localStorage.getItem("savedResponses")

  let summarizeContent = ""

  useEffect(() => {

   
       // Verificar si estamos en el entorno del cliente
    if (typeof window !== 'undefined') {
      const botResponses = localStorage.getItem('savedResponses');
      if (botResponses) {
        const savedResponsesArray = JSON.parse(botResponses);
        const contentArray = savedResponsesArray.map((response: any) => response.content);
        setResponses(contentArray);
      }
    }
    

  },[])


  const saveSummarizeToLocalStorage = () => {

    if (typeof window !== 'undefined') {

      localStorage.setItem("summarize",JSON.stringify(responses))

    }
   

  }

  return (
    <div className='flex mt-4 font-semibold w-full items-center justify-center flex-col gap-4'>

        <p>Aqui puedes editar el contenido generado por la IA</p>

        
      <TextareaAutosize
        minRows={12}
        maxRows={24}
        className='w-[95%] border-2 border-black'
        value={responses.join('\n')}
        onChange={(e) => setResponses(e.target.value.split('\n'))}
        />

        {responses.length > 0 && responses.some(response => response.trim() !== '') && <Link href={'/generate-audio'}>
            <Button onClick={saveSummarizeToLocalStorage} className='hover:bg-slate-400'>
              Generar Audio
            </Button>
          </Link>
        }

    </div>  
  )
}

export default SummarizePage