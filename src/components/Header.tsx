import Button from '@mui/material/Button'

export function Header() {
  return (
    <div className="border-b border-black">
      <div className="flex justify-between">
        <span className="text-3xl">Logo</span>
        <Button variant="outlined">Create Event</Button>
      </div>
    </div>
  )
}
