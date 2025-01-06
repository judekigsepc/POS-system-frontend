import { Button, Card, Spinner} from "flowbite-react";
import { useEffect, useState } from "react";

import { HiShoppingCart } from "react-icons/hi"
import { addToCart, apiUrl, getAllRecords } from "../assets/functions";
import {currency} from '../assets/utils'
import { eventEmitter } from "../assets/events";

function DisplayProducts() {
  const [products, setProducts] = useState('')

  useEffect(() => {
      getProducts()
  },[])

  const getProducts = async () => {
    const {result} = await getAllRecords('products')
    setProducts(result)
  }

  eventEmitter.on('trigger-refresh',async () => {
          await getProducts()
  })
  return (
    <>

    <div className="flex flex-wrap h-screen overflow-y-scroll w-full">
    <h1 className="text-3xl text-center w-full">Products</h1>

      {
        products? products.map((product) => {
          return (
            <Card
      className="max-w-sm m-1"
      key={product._id}
    >
      <img src={`${apiUrl}/${product.imgUrl}`} className="rounded-lg w-40 h-40 object-cover"></img>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {product.name}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Price: {currency} {product.price.toLocaleString()}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        In Stock: {product.inStock} {product.units}s
      </p>
      <Button onClick={ () => addToCart(product._id) }  color="dark">
      <HiShoppingCart className="mr-2 h-5 w-5" />
        Add To Cart
        </Button>
    </Card>
          )
        }) :<div>
              <Spinner aria-label="Waiting for invoice.." size="xl"/>{" "}
              Loading Products
              </div>
      }

 

    </div>
    

    </>
    
  );
}

export default DisplayProducts