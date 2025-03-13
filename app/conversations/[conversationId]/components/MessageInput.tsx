'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface Props{
    placeholder?: string,
    id: string,
    type?: string,
    required?: boolean,
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors
}

const MessageInput = ({placeholder, id, type, required, register, errors}: Props) => {
  return (
    <div className="relative w-full">
        <input id={id} type={type} autoComplete={id} {...register(id, {required})}
        placeholder={placeholder} className="
        text-black font-light py-3 px-4 bg-neutral-100
        w-full rounded-full focus:outline-none
        "/>
    </div>
  )
}

export default MessageInput