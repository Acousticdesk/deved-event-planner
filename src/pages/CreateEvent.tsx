import { Layout } from '../components/Layout.tsx';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import TextField from '@mui/material/TextField'

export function CreateEvent() {
  return (
    <Layout>
      <Container className="py-8">
        <div className="w-1/2 m-auto">
          <p className="text-4xl mb-8 text-center">Event Creation Form</p>
          <TextField placeholder="Event Title" fullWidth className="block mb-2" />
          <TextField placeholder="Time" fullWidth className="block mb-2" />
          <TextField placeholder="Location" fullWidth className="block mb-2" />
          <TextField placeholder="Additional Details..." fullWidth className="block mb-2" />
          <div className="flex justify-between">
            <FormControlLabel control={<Checkbox />} label="AI-generated thumbnail" />
            <Button variant="outlined">Send</Button>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
