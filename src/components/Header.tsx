import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'

export function Header() {
  const navigate = useNavigate()
  return (
    <div className="border-b border-black">
      <div className="flex justify-between">
        <Link to="/" className="text-3xl">Logo</Link>
        <Button onClick={() => navigate('/create-event')}>Create Event</Button>
      </div>
    </div>
  )
}
