import { Button,Label,List,Modal, Table, Textarea, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"

import ProductsMiniModal from "./ProductsMiniModal"
import { currency } from "../assets/utils"
import { addNonFormDataRecord, calculateCollection, handleCollectionResult } from "../assets/functions"
import { eventEmitter } from "../assets/events"

function CreateCollection () {
       const [modalOpen, setModalOpen] = useState(false)
       const [productModalOpen, setProductModalOpen] = useState(false)
       const [collectionProducts, setCollectionProducts] = useState([])

       const [formData, setFormData] = useState({
              name:'',
              collectionCode:'',
              description:'',
              stockAlert:true,
              stockAlertLimit:0,
              saleable:true,
              discount:0,
              discountType:'percent',
              color:'',
              items:[],
              priceValue:0
       })

       const handleChange = (e) => {
                setFormData({...formData, [e.target.name]: e.target.value})
       }

       const createCollection = async () => {
                console.log(formData)
                await addNonFormDataRecord('collections',formData)
                eventEmitter.emit('trigger-refresh')
       }

       const [collectionDiscountData, setCollectionDiscountData] = useState({
        discount:0,
        discountType:'percent'
       })
       const [collectionPriceData, setCollectionPriceData] = useState('')

       useEffect(() => {
            setFormData(
                {
                    ...formData, items:collectionProducts.map(product => product._id),
                    discountType:collectionDiscountData.discountType,
                    discount:collectionDiscountData.discount,
                    priceValue:collectionPriceData
                })
            calculateCollection(collectionProducts,collectionDiscountData)
          
       },[collectionProducts,collectionDiscountData])

       const closeModal = () => {
        setModalOpen(false)
        setCollectionProducts([])
        setCollectionDiscountData({})
        setCollectionPriceData('')
       }

       handleCollectionResult((data) => {
        setCollectionPriceData(data)
        setFormData({...formData, priceValue:data})
       })

         return (
            <>
            <div>
                <Button onClick={() => setModalOpen(true)}>Create New Collection</Button>

                <Modal show={modalOpen} onClose={() => closeModal()}>
                    <Modal.Header>Create new collection</Modal.Header>
                    <Modal.Body>
                        <div>
                        <Label className="text-md">Collection Name</Label>
                        <TextInput name='name'  onChange={(e) => handleChange(e)}></TextInput>
                        </div>

                        <div className="flex space-x-2 mt-4">
                        <Label className="text-md">Collection Code: </Label>
                        <TextInput size='sm' name="collectionCode"  onChange={(e) => handleChange(e)}></TextInput>
                        <Button>Auto Gen</Button>
                        </div>

                        <div>
                        <Label className="text-lg">Description: </Label>
                        <Textarea name='description'  onChange={(e) => handleChange(e)}></Textarea>
                        </div>

                        <div>
                            <Label>StockAlerting: </Label>
                            <select defaultValue='true' name="stockAlert"  onChange={(e) => handleChange(e)}>
                                <option value='true'>ON</option>
                                <option value='false'>OFF</option>
                            </select>
                        </div>

                       <div className="flex space-x-2 mt-4" >
                        <Label className="text-md">Stock Alert Threshold: </Label>
                        <TextInput size='sm' type="number" name="stockAlertLimit"  onChange={(e) => handleChange(e)}></TextInput>
                        </div>

                        <div>
                            <Label>Saleable </Label>
                            <select defaultValue='true' name="saleable"  onChange={(e) => handleChange(e)}>
                                <option value='true'>YES</option>
                                <option value='false'>NO</option>
                            </select>
                        </div>

                        <div className="flex space-x-2 mt-4">
                        <Label className="text-md">Discount:</Label>
                        <TextInput size='sm' type="number" onChange={(e) => setCollectionDiscountData({...collectionDiscountData, discount : e.target.value})}></TextInput>

                        
                        <Label>Type</Label>
                            <select defaultValue='percent'  onChange={(e) => setCollectionDiscountData({...collectionDiscountData, discountType : e.target.value})}>
                                <option value='percent'>Percent</option>
                                <option value='flat'>Flat</option>
                            </select>
                        </div>

                        
                    

                        <div className="flex space-x-2 mt-4">
                        <Label className="text-md">Color: </Label>
                        <input size='sm' type="color" name="color" onChange={(e) => handleChange(e)}></input>
                        </div>

                        <div className="flex space-x-2 mt-4">
                        <Label className="text-md">Products: </Label>
                        <Button onClick={() => setProductModalOpen(true)}>Choose products</Button>
                        </div>

                        <div>
                        <Table>
                                <Table.Head>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Price</Table.HeadCell>
                                    <Table.HeadCell>Discount</Table.HeadCell>
                                </Table.Head>
                            <Table.Body>
                        <h1>Current products list</h1>
                            {!collectionProducts?'No products': collectionProducts.map((product, index) => {
                                return (
                                    
                                            <Table.Row key={index}>
                                                <Table.Cell>{product.name}</Table.Cell>
                                                <Table.Cell>{currency} {product.price.toLocaleString()}</Table.Cell>
                                                <Table.Cell>{product.discount.toLocaleString()} {product.discountType === 'percent'?'%':'(flat)'}</Table.Cell>
                                                <Table.Cell>
                                                    <Button color="failure" size="xs" 
                                                    onClick={() => setCollectionProducts(prods => prods.filter((prod,prodIndex) => index !== prodIndex))}>
                                                        Remove
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                )
                            })
                            }
                            {collectionPriceData
                            ?<Table.Row>
                                <Table.Cell colSpan={3}>Total</Table.Cell>
                                <Table.Cell className="font-bold">{currency} {collectionPriceData.toLocaleString()}</Table.Cell>
                            </Table.Row>
                            :<Table.Row>
                                <Table.Cell colSpan={3}>No products in collection
                                    </Table.Cell>
                               </Table.Row>}
                                
                                </Table.Body>
                            </Table>
                        

                        </div>
                        <ProductsMiniModal modalOpen={productModalOpen} setModalOpen={setProductModalOpen} addProduct={setCollectionProducts}/>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button color="success" onClick={() => createCollection()}>Create</Button>
                        <Button color="failure" onClick={() => closeModal()}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            </>
         )
}

export default CreateCollection