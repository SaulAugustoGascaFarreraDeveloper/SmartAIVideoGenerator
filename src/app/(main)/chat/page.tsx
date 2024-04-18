"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { ChatFormSchema, ScrapeFormSchema } from '@/lib/schemas'
import Link from 'next/link'


interface Message{
    role: "user" | "bot"
    content: string
}



const ChatPage = () => {

    //const [getData,setGetData] = useState<string>("")

    const [isUrlLoading,setIsUrlLoading] = useState<boolean>(false)
    const [urlResponse,setUrlResponse] = useState<string>("")
    const [urlProcessedSuccesfull,setUrlProcessedSuccesfull] = useState<boolean>(false)


    const [isChatLoading,setIsChatLoading] = useState<boolean>(false)
    const [messages,setMessages] = useState<Message[]>([])


    const [saveResponses,setSaveResponses] = useState<Message[]>([])

    const ScrapeForm = useForm({
        resolver: zodResolver(ScrapeFormSchema)
    })

    const ChatForm = useForm({
        resolver: zodResolver(ChatFormSchema)
    })



    useEffect(() => {
        localStorage.removeItem("summarize")
        //localStorage.removeItem("savedResponses")
    })

    let endpoint = ""

    const onScrapeSubmit = async () => {

        setIsUrlLoading(true)

        try{

           
            

            const url = ScrapeForm.getValues().url
            
            endpoint = "https://webscraping-fastapi-backend.onrender.com/api/scrape"

            

            const response = await axios.post(endpoint,{url: url})

            console.log(response.data)

            //setGetData(JSON.stringify(response.data))

            setUrlResponse("URL VALIDA, ahora puedes chatear con el sitio web")

            setUrlProcessedSuccesfull(true)


        }catch(error)
        {
            console.log(error)

            setUrlResponse("Fallo la validacion de la Url")

        }finally{
            setIsUrlLoading(false)
        }


    }


    const onChatSubmit = async () => {

        setIsChatLoading(true)

        try{


            const message = ChatForm.getValues().message
            
            endpoint = "https://webscraping-fastapi-backend.onrender.com/api/chat"

            const response = await axios.post(endpoint,{message: message})

            console.log(response.data)

            setMessages([...messages,{role: 'user',content: message},{role: 'bot',content: response.data}])


        }catch(error)
        {
            console.log(error)

            //setMessages("HUBO UN ERROR EN LA RESPUESTA DE LA AI,intenta de nuevo")
            
        }finally{
            setIsChatLoading(false)
        }

        ChatForm.reset()
    }


    const handleSaveResponse = (response: Message) => {

        setSaveResponses((prevResponse) => [...prevResponse,response])
        localStorage.setItem("savedResponses",JSON.stringify([...saveResponses,response]))

    }

  return (
    <div className="px-4 lg:px-8 mt-4">
        {messages && <Link href={'/summarize'} className='mb-4'>,<Button>Generar Resumen</Button> </Link>}
        <Form {...ScrapeForm}>
            <form 
                onSubmit={ScrapeForm.handleSubmit(onScrapeSubmit)}
                className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-lg grid grid-cols-12 gap-2'
            >
                    <FormField 
                        name='url'
                        render={({field}) => (
                            <FormItem className='lg:col-span-10 col-span-12'>
                                <FormControl className='m-0 p-0'>
                                    <Input disabled={isUrlLoading} {...field} placeholder='Enter a valid URL exmaple http://example123.com' />
                                </FormControl>
                                
                            </FormItem>
                        )}
                    
                    />

                    <Button disabled={isUrlLoading} type='submit' className='hover:bg-slate-500 col-span-12 lg:col-span-2 w-full'>
                            Scrape URL
                    </Button>

                   
            </form>
        </Form>


        {urlProcessedSuccesfull && 
        
            <Form {...ChatForm}>
                <form 
                    onSubmit={ChatForm.handleSubmit(onChatSubmit)}
                    className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-lg grid grid-cols-12 gap-2'
                >
                    <FormField
                        name="message"
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                                <Input {...field} placeholder="Type your message" />
                            </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button disabled={isChatLoading} 
                    type='submit'
                    className="col-span-12 lg:col-span-2 w-full bg-green-600 text-white"
                    >
                        Send Message
                    </Button>

                </form>
            </Form>
        }


        {urlResponse && <p className='font-extrabold mt-4'>{urlResponse}</p>}

        {messages && 
        
        <div className="space-y-4 mt-4">

            {isChatLoading && (
                <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <h2 className='animate-pulse'>I AM THINKING ...</h2>
                </div>
            )}
        
            {
            messages.length === 0 &&
                urlResponse === "" &&
                !isChatLoading &&
                null /* This will not render anything */
            }
            <div className="flex flex-col-reverse gap-y-4">
                    {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${
                                    message.role === "user"
                                    ? "bg-white border border-black/10"
                                    : "bg-muted"
                                }`}
                                >
                                    {message.role === "user" ? "User" : "Bot"}
                                    <p className="text-sm">{message.content}</p>
                                    {message.role === "bot" && (
                                        <button onClick={() => handleSaveResponse(message)}>Guardar</button>
                                    )}
                            </div>
                    ))}
            </div>
        </div>
        
        }

       {isUrlLoading && <div className='space-y-4 mt-4 flex items-center justify-center font-extrabold '>
            <h2 className='animate-pulse'>Procesando Url ...</h2>
        </div>}


    </div>
  )
}

export default ChatPage