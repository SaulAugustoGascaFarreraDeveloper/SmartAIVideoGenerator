import React, { Dispatch, SetStateAction, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'

interface AIVoicesComboBoxComponentProps{
   
    setIsValidOption: React.Dispatch<SetStateAction<boolean>>
    setSpeed: Dispatch<SetStateAction<number>>
    speed: number
}


const AIVoicesComboBoxComponent = ({setIsValidOption,setSpeed,speed}: AIVoicesComboBoxComponentProps) => {

    const AISpeedVoice = [
        {
          value: 1.0,
          label: "1.0",
          span: "velocidad normal",
        },
        {
          value: 1.1,
          label: "1.1",
          span: "velocidad x.1",
        },
        {
          value: 1.2,
          label: "1.2",
          span: "velocidad x.2",
        },
        {
          value: 1.3,
          label: "1.3",
          span: "vvelocidad x.3",
        },
        {
          value: 1.4,
          label: "1.4",
          span: "velocidad x.4",
        },
        {
          value: 1.5,
          label: "1.5",
          span: "velocidad x.5",
        },
      ];

      const [open, setOpen] = useState<boolean>(false)
   


  return (
    <div>


        <Popover   open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[350px] justify-between"
                    >
                    {speed
                        ? (
                        <div>
                            <span className='mr-1'>{AISpeedVoice.find((framework) => framework.value === speed)?.label}</span>
                            <span className="text-xs opacity-50">{AISpeedVoice.find((framework) => framework.value === speed)?.span}</span>
                            
                        </div>
                        )
                        : "Selecciona una velocidad para el audio..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0">
                    <Command>
                    <CommandInput placeholder="Busca una velocidad..." />
                    <CommandEmpty>Ninguna velocidad coincide.</CommandEmpty>
                    <CommandGroup>
                        {AISpeedVoice.map((framework) => (
                        <CommandItem
                            key={framework.value}
                            value={framework.value.toString()}
                            onSelect={(currentValue) => {
                            setSpeed(currentValue === speed.toString() ? 0 : parseFloat(currentValue))
                            setOpen(false)
                            setIsValidOption(true);
                            }}
                            
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                speed === framework.value ? "opacity-100" : "opacity-0"
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