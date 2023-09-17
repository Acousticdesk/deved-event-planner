import { Layout } from '../components/Layout.tsx';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { db } from '../api.ts';
import { addDoc, collection } from 'firebase/firestore/lite';

import TextField from '@mui/material/TextField'
import { Toast } from '../components/Toast.tsx';

interface Inputs {
  event_name: string
  event_date: string
  event_location: string
}

export function CreateEvent() {
  const {
    register,
    watch,
    handleSubmit,
  } = useForm<Inputs>()
  
  const eventName = watch('event_name')
  
  const [hasToast, setHasToast] = useState(false)
  
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addDoc(collection(db, "events"), {
      ...data,
      event_date: Date.now()
    });
    setHasToast(true)
    navigate('/')
  }
  
  return (
    <Layout>
      <Container className="py-8">
        <div className="w-1/2 m-auto">
          <p className="text-4xl mb-8 text-center">Event Creation Form</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField placeholder="Event Title" fullWidth className="block mb-2" {...register('event_name')} />
            <TextField placeholder="Time" fullWidth className="block mb-2" {...register('event_date')} />
            <TextField placeholder="Location" fullWidth className="block mb-2" {...register('event_location')} />
            <TextField placeholder="Additional Details..." fullWidth className="block mb-2" />
            <div className="flex justify-between">
              <FormControlLabel control={<Checkbox />} label="AI-generated thumbnail" />
              <Button type="submit">Submit</Button>
            </div>
            {hasToast && <Toast severity="success" message={`${eventName} event was created`} />}
          </form>
        </div>
      </Container>
    </Layout>
  )
}
