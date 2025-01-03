import { Card, Button,TextInput,Modal, Dropdown, Textarea,Spinner } from "flowbite-react"

import { useState } from "react"

import { payment, handlePaymentResult, confirmPayment,socketEventMessageHandler, printInvoice, emailInvoice, socketErrorHandler } from "../assets/functions"
import { currency } from "../assets/utils"


function Payment ({cartTotal}) {
    const [payDetails, setPayDetails] = useState('')
    const [type,setType] = useState('purchase')
    const [notes, setNotes] = useState('Something to note about the transaction.')
    const [reEmail, setEmail] = useState()
    const [invoicePresent, setInvoicePresent] = useState(false)

    const [openModal, setOpenModal] = useState(false);
    const [printModal, setPrintModal] = useState(false)
 
    handlePaymentResult((data) => {
               setPayDetails(data)
           })

    socketErrorHandler((error) => {
      setOpenModal(false)
      setPrintModal(false)
    })

    const processTransaction = () => {
        confirmPayment(type,notes, '673e5a45e30f72ad5888a4a1')
        setOpenModal(false)
        setPrintModal(true)
    }

    const closePrintModal = () => {
        setPrintModal(false)
        setInvoicePresent(false)
    }

    socketEventMessageHandler((msg) => {
        if(msg == 'invoice-ready'){
            setPrintModal(true)
            setInvoicePresent(true)
        }
    })

    return (
        <>
         <Card>
    <h1>
        Cart Total:{" "}
        {cartTotal ? `${currency} ${cartTotal.toLocaleString()}` : `0`}
      </h1>
      
        <h1>
            Payment: <TextInput type="number" onChange={(e) => payment(Number(e.target.value))} value={payDetails.payed}></TextInput>
        </h1>

        <h1>
        Change:{" "}
        {payDetails ? `${currency} ${payDetails.change.toLocaleString()}` : `0`}
      </h1>

       <div className="flex space-x-2">
       <Button onClick={() => setOpenModal(true)}>Hold</Button>
       <Button  color="success"  onClick={() => setOpenModal(true)}>Process Payment</Button>
       </div>
     
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
             Enter the final information below
            </h3>

            <label>Notes:</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}>
            </Textarea>
            
            <div className="m-2">
            <Dropdown label="Transaction type" dismissOnClick={false}>
             <Dropdown.Item onClick={() => setType('purchase')}>purchase</Dropdown.Item>
               <Dropdown.Item onClick={() => setType('refund')}>refund</Dropdown.Item>
            </Dropdown>
            </div>

            <div className="flex justify-center gap-4">
              <Button color="success"  onClick={() => processTransaction()}>
                Confirm
              </Button>

              <Button color="gray" onClick={() => setOpenModal(false) }>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={printModal} size="md" onClose={() => setPrintModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
            {
                !invoicePresent? 
                <div>
                    <Spinner aria-label="Waiting for invoice.." size="xl"/>{" "}
                    Waiting for invoice....
                </div> :
                    
                    <div className="text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Invoice Ready!
               </h3>
   
              
                 <Button color="success"  onClick={() => printInvoice()} className="m-2">
                   Print Invoice
                 </Button>
                    
                 <TextInput type="text" className="w-full m-1"
                 placeholder="Enter receipient email here" 
                 value={reEmail} onChange={(e) => setEmail(e.target.value)}>
                 </TextInput>
                 
                 <Button color="success" onClick={() => emailInvoice(reEmail)} className="m-1">
                   Email Invoice
                 </Button>
   
                 
                 <Button color="failure" onClick={() => closePrintModal() } className="m-1">
                   Close
                 </Button>
                 </div>
                
            }
          

        </Modal.Body>
      </Modal>
    </Card>
        </>
    )
}

export default Payment