import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { collection, getDocs, GeoPoint } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { db } from './api.ts';
import { Layout } from './components/Layout.tsx';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface Event {
  event_name: string
  event_date: number
  event_location: GeoPoint
}

interface Inputs {
  search: string
}

const djLocalizer = dayjsLocalizer(dayjs)

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const { register, watch } = useForm<Inputs>()
  const navigate = useNavigate()
  useEffect(() => {
    const eventsCollection = collection(db, 'events')
    getDocs(eventsCollection).then((snapshot) => {
      const list = snapshot.docs.map(doc => doc.data() as Event)
      setEvents(list)
    });
  }, [])
  
  const search = watch('search')
  
  return (
    <Layout>
      <Container>
        <div className="p-8 flex items-center justify-center">
          <TextField placeholder="Search..." inputProps={{ className: "px-2 py-1", ...register('search') }} />
        </div>
        <p className="text-4xl text-center mb-2">All Events</p>
        <Calendar
          localizer={djLocalizer}
          scrollToTime={dayjs().toDate()}
          onSelectEvent={(event) => {
            navigate(`/events/${event.title}`)
          }}
          events={events.filter(({ event_name }) => event_name.toLowerCase().includes(search)).map(({ event_name, event_date }) => {
            const endDate = new Date(event_date)
            endDate.setHours(endDate.getHours() + 1)
            return {
              id: event_name,
              title: event_name,
              start: new Date(event_date),
              end: new Date(endDate),
            }
          })}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </Container>
    </Layout>
  )
}

export default App
