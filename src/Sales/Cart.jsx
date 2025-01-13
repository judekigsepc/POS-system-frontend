import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Card, Button, TextInput } from "flowbite-react";


import { deleteInCart, getFullCart, handleCartResult, handlePaymentResult, payment, updateCart } from "../assets/functions";
import { useEffect, useState } from "react";
import { currency } from "../assets/utils";

import Payment from "./Payment";

function Cart() {
    const [cartProducts, setCartProducts] = useState([])
    const [cartTotal,setCartTotal] = useState(0)
   
       useEffect(() => {
             getFullCart()
       },[])

        handleCartResult((cart) => {
            setCartProducts(cart.cartProducts)
            setCartTotal(cart.cartTotal)
            console.log(cartProducts) 
        })

       
   
    return ( 
        <>
       <div className="flex flex-col h-screen">
  {/* Header */}
  <h1 className="text-3xl text-center">Cart</h1>

  {/* Table Section */}
  <div className="flex-grow overflow-y-auto">
    <Table hoverable>
      <TableHead>
        <TableHeadCell>Product name</TableHeadCell>
        <TableHeadCell>Quantity</TableHeadCell>
        <TableHeadCell>Price</TableHeadCell>
        <TableHeadCell>Sub Total</TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {cartProducts ? (
          cartProducts.map((product, index) => (
            <TableRow
              className="bg-white dark:border-gray-700 dark:bg-gray-800 p-0"
              key={index}
            >
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {product.name}
              </TableCell>
              <TableCell>
                <button
                  className="text-red-700 text-2xl"
                  onClick={() => updateCart(index, product.qty - 1)}
                >
                  -
                </button>
                <input
                  value={product.qty}
                  onChange={(e) => updateCart(index, Number(e.target.value))}
                  className="w-8 p-1 m-0"
                ></input>
                <button
                  className="text-green-700 text-2xl"
                  onClick={() => updateCart(index, product.qty + 1)}
                >
                  +
                </button>
              </TableCell>
              <TableCell>
                {currency} {product.price.toLocaleString()}
              </TableCell>
              <TableCell>
                {currency} {product.subTotal.toLocaleString()}
              </TableCell>
              <TableCell>
                <Button color="failure" size="xs" className="text-xs" onClick={() => deleteInCart(index) }>Remove</Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              Cart Empty
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  </div>

  {/* Payment Card Section */}
  <div className="sticky bottom-0 bg-white p-4 shadow-lg">
   <Payment cartTotal={cartTotal}/>
  </div>
</div>
        </>
    )
}

export default Cart