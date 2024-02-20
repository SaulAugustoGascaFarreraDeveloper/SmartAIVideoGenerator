import { z } from "zod"

export const ScrapeFormSchema = z.object({
        url: z.string().url({message: "Please Enter a Valid URL"})
})



export const ChatFormSchema = z.object({
        message: z.string().min(1,"The Message is required")
})
