import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { getFirestore, collection, getDocs, Timestamp, GeoPoint } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import { Header } from './components/Header.tsx';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { app } from './api.ts';

interface Event {
  event_name: string
  event_date: Timestamp
  event_location: GeoPoint
}

const djLocalizer = dayjsLocalizer(dayjs)

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    const db = getFirestore(app);
    const eventsCollection = collection(db, 'events')
    getDocs(eventsCollection).then((snapshot) => {
      const list = snapshot.docs.map(doc => doc.data() as Event)
      setEvents(list)
    });
  }, [])
  
  return (
    <div>
      <Header />
      <Container>
        <div className="p-8 flex items-center justify-center">
          <TextField placeholder="Search..." inputProps={{ className: "px-2 py-1" }} />
        </div>
        <p className="text-4xl text-center mb-2">All Events</p>
        <Calendar
          localizer={djLocalizer}
          events={events.map(({ event_name }) => ({
            id: event_name,
            title: event_name,
            start: new Date(2023, 8, 15),
            end: new Date(2023, 8, 15),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </Container>
    </div>
  )
}

export default App
