import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useState } from 'react'

interface ToastProps {
  severity: AlertProps['severity']
  message: SnackbarProps['message']
}

export const Toast = ({ severity, message }: ToastProps) => {
  const [open, setOpen] = useState(true)
  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      action={<Button onClick={() => setOpen(false)}>Close</Button>}
      autoHideDuration={5000}
    >
      <MuiAlert elevation={6} variant="filled" severity={severity}>{message}</MuiAlert>
    </Snackbar>
  );
};
