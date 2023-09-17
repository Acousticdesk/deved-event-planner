import { Layout } from '../components/Layout.tsx';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import dayjs from 'dayjs';
import { useState, FormEvent } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../api.ts';
import { addDoc, getDocs, collection, query, where } from 'firebase/firestore/lite';

import TextField from '@mui/material/TextField'
import { Toast } from '../components/Toast.tsx';

import { Configuration, OpenAIApi } from "openai";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';

interface Inputs {
  event_name: string
  event_date: number
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
    setValue,
    control
  } = useForm<Inputs>({
    defaultValues: async () => {
      if (id) {
        const q = query(collection(db, 'events'), where('event_name', '==', id))

        const snapshot = await getDocs(q)
        const res = snapshot.docs[0].data()
        setValue('event_image', res?.event_image)
        return snapshot.docs[0].data() as Inputs
      }
      return {} as Inputs
    }
  })
  
  const eventName = watch('event_name')
  const eventImage = watch('event_image')
  
  const [hasToast, setHasToast] = useState(false)
  const [isEventImageLoading, setIsEventImageLoading] = useState(false)
  const [eventImageError, setEventImageError] = useState('')
  
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addDoc(collection(db, "events"), data);
    setHasToast(true)
    navigate('/')
  }
  
  const generateImage = async () => {
    setEventImageError('')
    try {
      const q = query(collection(db, 'keys'))
      const snapshot = await getDocs(q)
      const { key } = snapshot.docs[0].data()
      const configuration = new Configuration({
        apiKey: key,
      });
      const openai = new OpenAIApi(configuration);
      setIsEventImageLoading(true)
      const response = await openai.createImage({
        prompt: `professional photo from event ${eventName}`,
        n: 1,
        size: "256x256",
      }).finally(() => {
        setIsEventImageLoading(false)
      });
      return response.data.data[0].url;
    } catch (e) {
      setEventImageError("Can't generate your image now, please try again later...")
    }
  }
  
  const handleAIGenerateImageChange = async (e: FormEvent) => {
    if (!(e.target as HTMLInputElement).checked) {
      setValue('event_image', '')
      return
    }
    const url = await generateImage() as string
    setValue('event_image', url)
  }
  
  const pageTitle = id ? eventName : "Event Creation Form"
  
  return (
    <Layout>
      <Container className="py-8">
        <div className="w-1/2 m-auto">
          <p className="text-4xl mb-8 text-center">{pageTitle}</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField placeholder="Event Title" fullWidth className="block mb-2" {...register('event_name')} />
            <Controller
              control={control}
              name='event_date'
              render={({ field }) => (
                <DateTimePicker
                  label="Event Time"
                  className="w-full mb-2"
                  value={dayjs(field.value)}
                  onChange={(date: Dayjs | null) => {
                    if (!date || !date.isValid()) {
                      setValue('event_date', Date.now())
                      return
                    }
                    field.onChange(date.unix() * 1000)
                  }}
                />
              )}
            />
            <TextField placeholder="Location" fullWidth className="block mb-2" {...register('event_location')} />
            <TextField placeholder="Additional Details..." fullWidth className="block mb-2" {...register('event_description')} />
            <div className="text-center">
              {eventImage && <img src={eventImage} alt="Event Image" className="block m-auto" />}
              <TextField className="hidden" fullWidth {...register('event_image')} />
              {isEventImageLoading && <CircularProgress />}
              {eventImageError && <p>{eventImageError}</p>}
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
