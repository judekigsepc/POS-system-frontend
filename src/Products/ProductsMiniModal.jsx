import { Button, Modal, Table } from "flowbite-react"
import { useEffect, useState } from "react"
import { apiUrl, calculateCollection, getAllRecords } from "../assets/functions"
import { currency } from "../assets/utils"

function ProductsMiniModal ({modalOpen, setModalOpen,addProduct}) {
    const [products, setProducts] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        getProducts().then().catch((error) => console.log(error))
    },[])

    const getProducts = async () => {
          const {result} = await getAllRecords('products')
          console.log(result)
          setProducts(result)
    }

    const handleAddClick = (product) => {
        addProduct(prods => [...prods,product])
        setMessage(`${product.name} added to collection`)
        setTimeout(() => {
          setMessage('')
        },1000)
    }

    return (
        <>
        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Header>
                Products Mini Table
                {!message?'': 
                <span className="bg-green-500 text-white p-1 rounded-lg sticky">{message}</span>}

            </Modal.Header>
            <Modal.Body>
           
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Image</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Price</Table.HeadCell>
                        <Table.HeadCell>sku</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {
                            !products?<Table.Cell colSpan={4}>No Products in DB</Table.Cell>: products.map((product,index) => {
                                return (
                        <Table.Row key={index}>
                            <Table.Cell><img src={`${apiUrl}/${product.imgUrl}`} className="w-20 h-20 object-cover"></img></Table.Cell>
                            <Table.Cell>{product.name}</Table.Cell>
                            <Table.Cell>{currency} {product.price.toLocaleString()}</Table.Cell>
                            <Table.Cell>{product.sku}</Table.Cell>
                            <Table.Cell><Button size="xs" onClick={() => handleAddClick(product)}>Add</Button></Table.Cell>
                        </Table.Row>
                                )
                            } )
                        }
                        
                    </Table.Body>
                </Table>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default ProductsMiniModal