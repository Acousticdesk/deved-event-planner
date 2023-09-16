import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { getFirestore, collection, getDocs, Timestamp, GeoPoint } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react'
import { Header } from './components/Header.tsx';
import { app } from './api.ts';

interface Event {
  event_name: string
  event_date: Timestamp
  event_location: GeoPoint
}

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
        <p className="text-4xl text-center">All Events</p>
        <div>
          {events.map(({ event_name }) => {
            return (
              <div key={event_name}>
                <p>{event_name}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}

export default App
