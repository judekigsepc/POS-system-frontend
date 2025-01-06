import axios from 'axios'
import io from 'socket.io-client'

import { eventEmitter } from './events'

import { useState } from 'react'

const serverUrl = 'http://localhost:3000'

const apiUrl = `${serverUrl}/api`
const socket = io(serverUrl)

//CRUD FUNCTIONS

//Function to retreive all records of a given collection
const getAllRecords = async (collectionName) => {
    try{
         const response = await axios.get(`${apiUrl}/${collectionName}`)
         
         return response.data
    }catch(err) {
        return handleError(err)
    }
}

//Function to retrieve single record for whatever reason
const getSingleRecord = async (collectionName, id) => {
   try {
    const response = await axios.get(`${apiUrl}/${collectionName}/${id}`)
         
    return response.data
   }catch(err){
      return handleError(err)
   }
}

//CRUD PRODUCT ADD FUNCTION
const addRecord = async (collectionName,data) => {
  try {
    const formData = new FormData()

    for(const key in data){
        formData.append(key, data[key])
    }

     const response = await axios.post(`${apiUrl}/${collectionName}`, formData,{
        headers: {
            'Content-Type':'multipart/form-data'
        }
     })

     successEmitter(response.data)
     return response.data

  }catch(err) {
    handleError(err)
}
}

//CRUD OTHERS ADD FUNCTION
const addNonFormDataRecord = async (collectionName,data) => {
    try {
        const response = await axios.post(`${apiUrl}/${collectionName}`, data)

        successEmitter(response.data)
        return response.data

    }catch(err) {
        handleError(err)
    }
}

//CRUD NON FORM DATA UPDATE FUNCTION
const updateNonFormDataRecord = async (collectionName,id,data) => {
      try {
        const response = await axios.put(`${apiUrl}/${collectionName}/${id}`, data)

        successEmitter(response.data)
        return response.data
      }catch(err) {
        handleError(err)
      }
}

//CRUD UPDATE FUNCTION
const updateRecord = async (collectionName,id,data) => {
    try {
        const formData = new FormData()
    
        for(const key in data){
            formData.append(key, data[key])
        }
    
         const response = await axios.put(`${apiUrl}/${collectionName}/${id}`, formData,{
            headers: {
                'Content-Type':'multipart/form-data'
            }
         })

         successEmitter(response.data)
         return response.data
    
      }catch(err) {
        handleError(err)
    }
}

//CRUD DELETE FUNCTION
const deleteRecord = async (collectionName,id) => {
    try {
        const response = await axios.delete(`${apiUrl}/${collectionName}/${id}`)

        successEmitter(response.data)

        return response.data

    }catch(err){
       return handleError(err)
    }
}

const registerUser = async(data) => {
    try{
       const formData = new FormData()

       for(const key in data) {
           formData.append(key, data[key])
       }

       const response = await axios.post(`${apiUrl}/auth/register`, formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
       })

       return response.data
    }
    catch(err) {
       return handleError(err)
    }
}
 
const loginUser = async (data) => {
    try{
          const urlencodedData = new URLSearchParams(data)

          const response = await axios.post(`${apiUrl}/auth/login`, urlencodedData, {
            headers:{
                'Content-Type' :'application/x-www-form-urlencoded'
            }
          })

          const { token}  = response.data
          localStorage.setItem('authToken',token)
    }catch(err) {
        handleError(err)
    }
}

const updateUser = async (id,data) => {
    try{
        const formData = new FormData()

        for(const key in data) {
            formData.append(key, data[key])
        }
        const response = await axios.put(`${apiUrl}/auth/update/${id}`,formData, {
            headers: {
                'Content-Type' : 'multipart/form-data'
            }
        })
    
        return response.data
    }catch(err) {
        handleError(err)
    }
}

const deleteUser = async (id) => {
        try{
             const response = await axios.delete(`${apiUrl}/auth/delete/${id}`)
             return response.data
        }
        catch(err) {
            handleError(err)
        }
}

// REAL TIME FUNCTIONS WITH SOCKET IO

//Error receiver
const socketErrorHandler = (callback) => {
    eventEmitter.on('error', (error) => {
        callback(error)
    })

    socket.once('error',(data) => {
    console.error(data)
    callback(data)
})} 

//Socket success message handler
const socketSuccessMessageHandler = (callback) => {
    eventEmitter.on('success', (msg) => {
        callback(msg)
    })

    socket.off('socket-success-message')
    socket.on('socket-success-message',(msg) => {
        console.log(`Success: ${msg}`)
        callback(msg)
    })
} 
//Socket event notifyer handler
const socketEventMessageHandler = (callback) => {
    socket.off('socket-event-message')
    socket.on('socket-event-message', (msg) => {
        callback(msg)
    })
}

//Notification handler
socket.off('notification')
socket.on('notification', (data) => {
    console.log(data)
})


//Socket message handler
const socketTaskMessageHandler = (msg) => {
    console.log(msg)
}
const socketInvoiceNameHandler = (invoiceName) => {
   currentInvoiceName = invoiceName
}
const socketAlertMessageHandler = (alert) => {
    console.log(alert)
}
const unknownSocketMessageHandler  = (msg) => {
  console.log(`Unknown ${msg}`)
}

socket.off('socket-message')
socket.on('socket-message',(flag,msg) => {
    const handler =  socketMessageHandlers[flag]
    if(handler) {
        handler(msg)
    }
    else {
        unknownSocketMessageHandler(msg)
    }

})
const socketMessageHandlers = {
    'task' : socketTaskMessageHandler,
    'invoice-name' : socketInvoiceNameHandler,
    'alert' :socketAlertMessageHandler
}


//Function to add to the cart
const addToCart = (prodId,qty) => {
    socket.emit('add_to_cart', {prodId, qty})
}

//Function to update the cart
const updateCart = (prodIndex, qty) => {
  socket.emit('update_qty',{prodIndex, qty})
}

//Function to delete from cart
const deleteInCart = (prodIndex) => {
    socket.emit('delete_from_cart',prodIndex)
}

//Funtion to discount from cart
const discountCart = (discount,type) => {
    socket.emit('discount_cart',{discount,type})
}

//Function to pay- only works with cash
const payment = (amount) => {
    socket.emit('payment', amount)
}

//Function to confirm payment, gen receipt and update inventory
const confirmPayment = (type,notes,executor) => {
    socket.emit('confirm_payment',{type,notes,executor})
}

//Function to handle invoice printing
let currentInvoiceName
const printInvoice = async () => {
     socket.emit('print-invoice',currentInvoiceName)
}

//Function to handle invoice emailing
const emailInvoice = (reEmail) => {
    socket.emit('email-invoice',currentInvoiceName,reEmail)
}

//Function to invoke cart clean up
const cleanCart = () => {
    socket.emit('cart-cleanup')
}

//Function to emit collection calculations
const calculateCollection = (productsData,discountData) => {
    socket.emit('calculate-collection',{productsData,discountData})
}


//Function that handles results and changes in the cart
const handleCartResult = (callback) => {
    socket.off('result')
    socket.off('upt_result')
    socket.off('delete_command')
    socket.off('discount_result')

    const [cart, setCart] = useState({
        cartProducts : [],
        cartTotal : 0,
        cartGeneralDiscount:0,
    }) 
    
    
    //addition result handler
    socket.on('result', (data) => { 

    const updatedCart = {
        ...cart,
        cartTotal: data.cartTotal,
        cartProducts: [...cart.cartProducts, data.product]
    }

      setCart(updatedCart)
      callback(updatedCart)
    })
     
    //Update result handler
    socket.on('upt_result',(data) => {
        const {prodIndex, productToUpdate,cartTotal} = data
        const updatedProducts = [...cart.cartProducts]
        updatedProducts[prodIndex] = productToUpdate

        const updatedCart = {
            ...cart,
            cartTotal: cartTotal,
            cartProducts: updatedProducts
        }
        
        setCart(updatedCart)
        callback(updatedCart)
    })

    //The Great Deleter 😅 Deletion command to your cart array
    socket.on('delete_command', (data) => {
        const {cartTotal, prodIndex} = data
        cart.cartProducts.splice(prodIndex, 1)
        cart.cartTotal = cartTotal
        const updatedCart = {
            ...cart,
            cartProducts:[...cart.cartProducts],
            cartTotal:cart.cartTotal
        }

        setCart(updatedCart)
        callback(updatedCart)
    })

    //Discounting result handler
    socket.on('discount_result', (data) => {
        const {cartGeneralDiscount, cartTotal} = data

        cart.cartGeneralDiscount = cartGeneralDiscount
        cart.cartTotal = cartTotal

        callback(cart)
    })

    //Clean up the cart
    socket.on('cart-cleanup',() => {
        cart.cartProducts = []
        cart.cartTotal = 0
        cart.cartGeneralDiscount = 0 

        callback(cart)
    })
}

//Function to handle payments, receipts and inventory updates
const handlePaymentResult = (callback) => {
    socket.off('pay_result')

    socket.on('pay_result',(payDetails) => {
        callback(payDetails)
    })

    socket.on('pay_cleanup',(payDetails) => {
        callback(payDetails)
    })
}

//Hanling Document processing results
const handleDocResult = (callback) => {
    socket.off('pdf-invoice')

    socket.on('pdf-invoice', (pdfPath) => {
        callback(`${apiUrl}/${pdfPath}`)
    })
}

//Handling collection calculating results 
const handleCollectionResult = (callback) => {
    socket.once('collection-calc-result' , (result) => {
        callback(result)
    })
}
 

const successEmitter = (responseData) => {
       const {message} = responseData
       eventEmitter.emit('success', message)
}

//Function that handles CRUD operation errors
const handleError = (err) => {
    console.log(err.response.data)

    const {error, details} = err.response.data
    eventEmitter.emit('error', `Error: ${error}. Details:${details}`) 
}

export {
    //CRUD EXPORTS
    getAllRecords, 
    getSingleRecord,
    updateRecord, 
    deleteRecord,
    addRecord, 
    addNonFormDataRecord,
    updateNonFormDataRecord,

    //AUTH FUNCTIONS
    registerUser,
    loginUser,
    updateUser,
    deleteUser,

   //REAL TIME FUNCTION EXPORTS
    addToCart, 
    updateCart ,
    handleCartResult, 
    deleteInCart,
    discountCart,
    payment,
    handlePaymentResult,
    handleDocResult,
    confirmPayment,
    printInvoice,
    emailInvoice,
    cleanCart,
    calculateCollection,
    handleCollectionResult,
    apiUrl,

    //Handlers
    socketErrorHandler,
    socketSuccessMessageHandler,
    socketTaskMessageHandler,
    socketInvoiceNameHandler,
    socketAlertMessageHandler,
    socketEventMessageHandler,
}
