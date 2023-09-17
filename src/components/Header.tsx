import { Link } from 'react-router-dom';

export function Header() {
  return (
    <div className="border-b border-black">
      <div className="flex justify-between">
        <span className="text-3xl">Logo</span>
        <Link to="/create-event">Create Event</Link>
      </div>
    </div>
  )
}
