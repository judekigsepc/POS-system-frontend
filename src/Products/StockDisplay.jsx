import { Button, Card, Spinner, Table, TableCell, TableHead,Modal} from "flowbite-react";
import { useEffect, useState } from "react";

import { HiShoppingCart } from "react-icons/hi"
import { apiUrl, getAllRecords } from "../assets/functions";
import {currency} from '../assets/utils'

import { editIconRed, menuIcon } from "../assets/icons";

import EditModal from "./EditModal";

function StockDisplay() {
  const [products, setProducts] = useState('')
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [infoModalData, setInfoModalData] = useState('')

  const [productToEditId, setProductToEditId] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
      getProducts()
  },[])

  const getProducts = async () => {
    const {result} = await getAllRecords('products')
    setProducts(result)
  }

  const handleMenuClick = (product) => {
        setInfoModalOpen(true)
        setInfoModalData(product)
  }

  const handleEditClick  = (productId) => {
    setProductToEditId(productId)
    setEditModalOpen(true)
  }

  return (
    <>

    <EditModal openState={editModalOpen} setOpenState={setEditModalOpen} productId={productToEditId} refetch = {getProducts}/>

     <Modal show={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
      <Modal.Header> Additional product Info</Modal.Header>
      <Modal.Body>
           {
            !infoModalData?'Error':
            <div>
              <div>
                Name: {infoModalData.name}
                </div>
                 <div>
                Product Code: {infoModalData.prodCode}
                </div>

               <div>
               Creation Date: {infoModalData.createdAt}
               </div>
               <div>
               Last Update date: {infoModalData.updatedAt}
               </div>
               <div>
               Unique DB ID: {infoModalData._id}
               </div>
              
            </div>
           }
      </Modal.Body>
     </Modal>

    <div className="flex flex-wrap h-screen overflow-y-scroll w-full">
    <h1 className="text-3xl text-center w-full">Stock</h1>

     <Table hoverable>
      <Table.Head>
        <Table.HeadCell>
          Product
        </Table.HeadCell>
        <Table.HeadCell>
          SKU
        </Table.HeadCell>
        <Table.HeadCell>
          Image
        </Table.HeadCell>
        <Table.HeadCell>
          Price
        </Table.HeadCell>
        <Table.HeadCell>
          Discount
        </Table.HeadCell>
        <Table.HeadCell>
          In stock
        </Table.HeadCell>
        <Table.HeadCell>
          Stock alerting
        </Table.HeadCell>
        <Table.HeadCell>
          Stock alert limit
        </Table.HeadCell> 
        <Table.HeadCell>
          Tax
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
     {
        products? products.map((product, index) => {
          return (
          <Table.Row key={index}>
            <Table.Cell>
              {product.name}
            </Table.Cell>
            <Table.Cell>
               {product.sku}
            </Table.Cell>
            <Table.Cell>
              <img src={`${apiUrl}/${product.imgUrl}`} className="w-20 h-20 object-cover rounded-lg"></img>
            </Table.Cell>
            <Table.Cell>
              {currency}{" "}{product.price.toLocaleString()}
            </Table.Cell>
            <Table.Cell>
              {product.discountType == 'flat'? `${currency} ${product.discount.toLocaleString()} (flat)`: `${product.discount}%`}
            </Table.Cell>
            <Table.Cell>
              {product.inStock} {product.units}s
            </Table.Cell>
            <Table.Cell>
              {product.stockAlert ? <span className="font-bold">ON</span>:<span className="font-bold">OFF</span>}
            </Table.Cell>
            <Table.Cell>
              {product.stockAlertLimit} {product.units}s
            </Table.Cell>
            <Table.Cell>
              {currency} {product.taxes}
            </Table.Cell>
            <Table.Cell>
            <img src={menuIcon} className="w-10 cursor-pointer" onClick={() => handleMenuClick(product)}></img>
            </Table.Cell>
            <Table.Cell>
              <img src={editIconRed} className="w-10 cursor-pointer" onClick = {() => handleEditClick(product._id)}></img>
            </Table.Cell>
          </Table.Row>
          )
        }) : <Table.Row >
          <Spinner aria-label="Waiting for invoice.." size="xl"/>{" "}
           Loading products in stock
        </Table.Row>      
      }
       </Table.Body>
     </Table>

    </div>
    

    </>
    
  );
}

export default StockDisplay