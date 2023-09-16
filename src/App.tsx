import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { Header } from './components/Header.tsx';
import './App.css'

function App() {
  return (
    <div>
      <Header />
      <Container>
        <div className="p-8 flex items-center justify-center">
          <TextField placeholder="Search..." inputProps={{ className: "px-2 py-1" }} />
        </div>
        <p className="text-4xl text-center">All Events</p>
        <div className="">
          <div>
            <p>Event 1</p>
          </div>
          <div>
            <p>Event 2</p>
          </div>
          <div>
            <p>Event 3</p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default App
