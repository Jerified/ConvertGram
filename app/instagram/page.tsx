'use client'

import {useState} from 'react'
import {useForm} from 'react-hook-form'
import { motion } from 'framer-motion'
import { FaExclamationCircle } from 'react-icons/fa'
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios'

const InstagramPage = () => {
    const { toast } = useToast();
    const [imageUrl, setimageUrl] = useState('')

    const {register, handleSubmit, formState: {
        errors}}  = useForm()

        const onSubmit =  async(data: any) => {
    // const handleSubmit = async (event: any) => {
    //     event.preventDefault()

        try {
            const response = await fetch('api/instagram/route', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    imageUrl: data.imageUrl
                }),
            })

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "An error occured while converting the image to PDF",
                    duration: 5000,
                  })
            }

            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = 'instagram-image.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            // setimageUrl('')
            toast({
                // variant: "success",
                title: "PDF generated successfully",
                duration: 5000,
              })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "An error occured while converting the image to PDF",
                duration: 5000,
              })
        }
    }
  return (
    <div className='min-h-[calc(100vh-6rem)] flex justify-center items-center'>
        <form action="" className="flex flex-col gap-4 w-[40%]" onSubmit={handleSubmit(onSubmit)}>
            <input type="text" className="h-12 rounded-lg px-2 outline-none" id='imageUrl' placeholder='Enter the Instagram image URL' {...register('imageUrl', {required: true})}/>
            {errors.imageUrl && (
                <motion.div className="mt-[-0.7rem] flex gap-1 items-center text-xs"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}} 
                >
                    <FaExclamationCircle color= 'red' /> This field is required
                </motion.div>
            )}
            <button className="bg-[#D691CE] px-4 py-2 rounded-lg hover:bg-[#AC58F5] transition" type='submit'>Download PDF</button>
        </form>
    </div>
  )
}

export default InstagramPage