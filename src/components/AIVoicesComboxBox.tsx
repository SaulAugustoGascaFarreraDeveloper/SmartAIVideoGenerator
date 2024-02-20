import React, { Dispatch, SetStateAction, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'

interface AIVoicesComboBoxComponentProps{
   
    setIsValidOption: React.Dispatch<SetStateAction<boolean>>
    setVoiceValue: Dispatch<SetStateAction<string>>
    voiceValue: string
}


const AIVoicesComboBoxComponent = ({setIsValidOption,setVoiceValue,voiceValue}: AIVoicesComboBoxComponentProps) => {

    const AIVoices = [
        {
          value: "alloy",
          label: "Alloy",
          span: "voz masculina",
        },
        {
          value: "echo",
          label: "Echo",
          span: "voz masculina",
        },
        {
          value: "fable",
          label: "Fable",
          span: "voz masculina",
        },
        {
          value: "onyx",
          label: "Onyx",
          span: "voz masculina",
        },
        {
          value: "nova",
          label: "Nova",
          span: "voz femenina",
        },
        {
          value: "shimmer",
          label: "Shimmer",
          span: "voz femenina",
        },
      ];

      const [open, setOpen] = useState<boolean>(false)
    //const [voiceValue, setVoiceValue] = useState<string>("")
    //const [isValidOption, setIsValidOption] = useState<boolean>(false);
    //const [value,setValue] = useState<string>("")


  return (
    <div>


        <Popover   open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between"
                    >
                    {voiceValue
                        ? (
                        <div>
                            <span className='mr-1'>{AIVoices.find((framework) => framework.value === voiceValue)?.label}</span>
                            <span className="text-xs opacity-50">{AIVoices.find((framework) => framework.value === voiceValue)?.span}</span>
                            
                        </div>
                        )
                        : "Selecciona un tipo de Voz..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                    <Command>
                    <CommandInput placeholder="Busca una Voz..." />
                    <CommandEmpty>Ninguna voz coincide.</CommandEmpty>
                    <CommandGroup>
                        {AIVoices.map((framework) => (
                        <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                            setVoiceValue(currentValue === voiceValue ? "" : currentValue)
                            setOpen(false)
                            setIsValidOption(true);
                            }}
                            
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                voiceValue === framework.value ? "opacity-100" : "opacity-0"
                            )}
                            />
                            <div>
                            <span className='mr-1'>{framework.label}</span>
                            <span className="text-xs opacity-50">{framework.span}</span>
                            
                            </div>
                        </CommandItem>
                        ))}
                    </CommandGroup>
                    </Command>
                </PopoverContent>
                </Popover>



    </div>
  )
}

export default AIVoicesComboBoxComponent