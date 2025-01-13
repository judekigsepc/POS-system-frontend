import { Table,Modal,Spinner, Button, TableBody } from "flowbite-react"
import { useState,useEffect } from "react"
import { getAllRecords, getSingleRecord, resumeSale } from "../assets/functions"
import { currency } from "../assets/utils"
import { useNavigate } from "react-router-dom"



 export default function HeldSales () {
  const [heldSales,setHeldSales] = useState([])
  const [items, setItems] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

    useEffect(() => {
        getHeldSales()
    },[])
  
    const getHeldSales = async () => {
      const {result} = await getAllRecords('holds')
      console.log(result)
      setHeldSales(result)
    }

    const openModal = (products,collections) => {
      setItems([...products,...collections])
      setModalOpen(true) 
    }

    const handleSaleResume = (saleId) => {
        resumeSale(saleId)
        
        navigate('/sale')
    }

    return (
      <>
      <div className="flex flex-wrap h-screen overflow-y-scroll w-full">
      <h1 className="text-3xl text-center w-full">Stock</h1>
  
       <Table hoverable>
        <Table.Head>
          <Table.HeadCell>
            Identifier
          </Table.HeadCell>
          <Table.HeadCell>
             Reason
          </Table.HeadCell>
          <Table.HeadCell>
             Date Added
          </Table.HeadCell>
          <Table.HeadCell>
             Executor
          </Table.HeadCell>
         
        </Table.Head>
        <Table.Body className="divide-y">
       {
          heldSales? heldSales.map((sale) => {
            return (
              <Table.Row key={sale._id}>
                <Table.Cell>{sale.identifier}</Table.Cell>
                <Table.Cell>{sale.reason}</Table.Cell>
                <Table.Cell>{sale.createdAt}</Table.Cell>
                <Table.Cell>{sale.executor.names}</Table.Cell>
                <Table.Cell><Button onClick={() => openModal(sale.products, sale.collections)} color="blue" size="sm">View items</Button></Table.Cell>
                <Table.Cell><Button color="success" size="sm" onClick={() => handleSaleResume(sale._id)}>Resume sale</Button></Table.Cell>
              </Table.Row>
            )
          }) : <Table.Row >
            <Spinner size="xl"/>{" "}
             Loading held sales
          </Table.Row>      
        }
         </Table.Body>
       </Table>
  
        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Header>Poducts in held sale</Modal.Header>
          <Modal.Body>
               <Table>
                <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                </Table.Head>
                <TableBody>
                  {
                    items.length < 1?'Error loading sale items': items.map((item) => {
                      return (
                        <Table.Row>
                       <Table.Cell>{item.name}</Table.Cell>
                       <Table.Cell>{currency} {item.price}</Table.Cell>
                       </Table.Row>
                      )
                    })
                  }
                </TableBody>
               </Table>
          </Modal.Body>
        </Modal>
      </div>
      
  
      </>
      
    )
}