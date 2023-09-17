import { Layout } from '../components/Layout.tsx';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import dayjs from 'dayjs';
import { useState, FormEvent, useCallback, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../api.ts';
import { addDoc, getDocs, collection, query, where } from 'firebase/firestore/lite';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

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

const containerStyle = {
  width: '400px',
  height: '400px'
};

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
      return {
        event_date: Date.now(),
        event_description: '',
        event_image: '',
        event_location: '',
        event_name: ''
      } as Inputs
    }
  })
  
  const eventName = watch('event_name')
  const eventImage = watch('event_image')
  const eventLocation = watch('event_location')
  
  const [hasToast, setHasToast] = useState(false)
  const [isEventImageLoading, setIsEventImageLoading] = useState(false)
  const [eventImageError, setEventImageError] = useState('')

  const center = {
    lat: eventLocation ? parseFloat(eventLocation.split(',')[0]) : 53.54257718389261,
    lng: eventLocation ? parseFloat(eventLocation.split(',')[1]) : -113.49767851787895,
  };
  
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addDoc(collection(db, "events"), data);
    setHasToast(true)
    window.setTimeout(() => {
      navigate('/')
    }, 2000)
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

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAmwORDeV0GTzkwHOJq0s6iecfaTPIOgJE"
  })
  
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  
  useEffect(() => {
    if (id && map) {
      const location = new google.maps.LatLng(center.lat, center.lng);

      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      
      if (marker) {
        marker.setMap(null)
      }

      const newMarker = new window.google.maps.Marker({
        position: location,
        map: map,
      });

      setMarker(newMarker)
    }
  }, [map, center.lng, center.lat])

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback() {
    setMap(null)
  }, [])
  
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
            {isMapLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                onLoad={onLoad}
                onUnmount={onUnmount}
                zoom={5}
                options={{
                  maxZoom: 17
                }}
                onClick={(event) => {
                  if (id) {
                    return
                  }
                  if (marker) {
                    marker.setMap(null)
                    setMarker(null)
                  }
                  
                  const newMarker = new window.google.maps.Marker({
                    position: event.latLng,
                    map: map,
                  });
                  
                  setMarker(newMarker)
                  setValue('event_location', `${event.latLng?.lat()},${event.latLng?.lng()}`)
                }}
              />
            ) : <CircularProgress />}
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
              {!id && <Button disabled={hasToast} type="submit">Submit</Button>}
            </div>
            {hasToast && <Toast severity="success" message={`${eventName} event was created`} />}
          </form>
        </div>
      </Container>
    </Layout>
  )
}
