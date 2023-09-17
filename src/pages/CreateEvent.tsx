import { Layout } from '../components/Layout.tsx';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useForm, SubmitHandler } from "react-hook-form"
import { useState, FormEvent } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../api.ts';
import { addDoc, getDocs, collection, query, where } from 'firebase/firestore/lite';

import TextField from '@mui/material/TextField'
import { Toast } from '../components/Toast.tsx';

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

interface Inputs {
  event_name: string
  event_date: string
  event_location: string
  event_image: string
  event_description: string
}

export function CreateEvent() {
  const { id } = useParams()
  
  const {
    register,
    watch,
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: async () => {
      if (id) {
        const q = query(collection(db, 'events'), where('event_name', '==', id))

        const snapshot = await getDocs(q)
        const res = snapshot.docs[0].data()
        setEventImageSrc(res?.event_image)
        return snapshot.docs[0].data() as Inputs
      }
      return {} as Inputs
    }
  })
  
  const eventName = watch('event_name')
  
  const [hasToast, setHasToast] = useState(false)
  const [eventImageSrc, setEventImageSrc] = useState('')
  const [isEventImageLoading, setIsEventImageLoading] = useState(false)
  
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addDoc(collection(db, "events"), {
      ...data,
      event_date: Date.now()
    });
    setHasToast(true)
    navigate('/')
  }
  
  const generateImage = async () => {
    setIsEventImageLoading(true)
    const response = await openai.createImage({
      prompt: `professional photo from event ${eventName}`,
      n: 1,
      size: "256x256",
    }).finally(() => {
      setIsEventImageLoading(false)
    });
    return response.data.data[0].url;
  }
  
  const handleAIGenerateImageChange = async (e: FormEvent) => {
    if (!(e.target as HTMLInputElement).checked) {
      setEventImageSrc('')
      return
    }
    const url = await generateImage() as string
    setEventImageSrc(url)
  }
  
  const pageTitle = id ? eventName : "Event Creation Form"
  
  return (
    <Layout>
      <Container className="py-8">
        <div className="w-1/2 m-auto">
          <p className="text-4xl mb-8 text-center">{pageTitle}</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField placeholder="Event Title" fullWidth className="block mb-2" {...register('event_name')} />
            <TextField placeholder="Time" fullWidth className="block mb-2" {...register('event_date')} />
            <TextField placeholder="Location" fullWidth className="block mb-2" {...register('event_location')} />
            <TextField placeholder="Additional Details..." fullWidth className="block mb-2" {...register('event_description')} />
            <div className="text-center">
              {eventImageSrc && <img src={eventImageSrc} alt="Event Image" className="block m-auto" />}
              <TextField className="hidden" fullWidth {...register('event_image')} value={eventImageSrc} />
              {isEventImageLoading && <CircularProgress />}
            </div>
            <div className="flex justify-between">
              <FormControlLabel
                control={<Checkbox onChange={handleAIGenerateImageChange} />}
                label="AI-generated thumbnail"
              />
              <Button type="submit">Submit</Button>
            </div>
            {hasToast && <Toast severity="success" message={`${eventName} event was created`} />}
          </form>
        </div>
      </Container>
    </Layout>
  )
}
