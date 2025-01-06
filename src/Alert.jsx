import { Alert } from "flowbite-react";
import { useState } from "react";
import { socketErrorHandler, socketSuccessMessageHandler } from "./assets/functions";

export function AlertBar() {
    const [alertColor, setAlertColor] = useState('')
    const [dismissed, setDismissed] = useState('')
    const [alertMessage, setAlertMessage] = useState('')

    socketErrorHandler((error) => {
        setAlertColor('failure')
        setAlertMessage(error)
        setDismissed(false)
    })

    socketSuccessMessageHandler((msg) => {
        setAlertColor('success')  
        setAlertMessage(m => msg)
        setDismissed(false)
    })

  return (
    <Alert color={alertColor} onDismiss={() => setDismissed(true)} className= {`z-50 absolute w-screen ${dismissed?'hidden':''}`}>
      <span className="font-medium">{alertMessage}</span>
    </Alert>
  );
}

export default AlertBar