'use client'

import Modal from "@/app/components/Modal";
import Image from "next/image";

interface IMProps{
    src?: string | null;
    isOpen?: boolean;
    onClose: ()=> void;
}

const ImageModal: React.FC<IMProps> = ({src, isOpen, onClose}) => {

    if(!src){
        return null
    }
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
        <div className="w-80 h-80">
        <Image fill alt="Image" src={src} className="object-cover"/>
        </div>
    </Modal>
  )
}

export default ImageModal