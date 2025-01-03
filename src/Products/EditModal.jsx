import { Modal } from "flowbite-react"
import { useEffect, useState } from "react"
import { getSingleRecord,updateRecord,deleteRecord } from "../assets/functions"
import { currency  } from "../assets/utils"
import { Button, FileInput, Label, TextInput } from "flowbite-react"

function EditModal ({openState,setOpenState,productId,refetch}) {
    const [product, setProduct] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [formData, setFormData] = useState({
      
   })
   
  const handleChange = (e) => {

    const {name, value} = e.target
      setFormData({
        ...formData,
        [name]:value
      })
  }

  const handleImageUpload = (e) => {
    const image = e.target.files[0]
    setPreviewImage(URL.createObjectURL(image))

    setFormData({
      ...formData,
      image:image
    })
  }

  const updateProduct = async () => {
    console.log(formData)
    setPreviewImage('')
    setOpenState(false)
    await updateRecord('products',productId,formData)
    setFormData({})
    refetch()
  }

  const deleteProduct = async () => {
    setPreviewImage('')
    setOpenState(false)
    await deleteRecord('products',productId)
    setFormData({})
    refetch()
  }

    useEffect(() => {
        if(productId){
            const getProduct = async () => {
                const {result} = await getSingleRecord('products',productId)
                setProduct(result)
            }
            getProduct()
        }
    },[productId])
    return (
        <>
        {
            !productId?'': 
        <Modal show={openState} onClose={() => setOpenState(false)}>
            <Modal.Header>Edit {product.name}</Modal.Header>
             <Modal.Body>
                   {/* {product image preview} */}
   <div className="w-56 bg-gray-400 rounded-lg p-2 text-white object-cover">
    <h1>Image preview</h1>
    {
      previewImage?<img src={previewImage} className="rounded-lg"></img>:'No Image preview'
    }
    
   </div>

  <div className="mb-4">
    <Label htmlFor="product-name" className="block text-lg font-medium mb-1">Product Image</Label>
    <FileInput accept="image/*" name="image" onChange={(e) => handleImageUpload(e)}></FileInput>
  </div>

  {/* Product Name */}
  <div className="mb-4">
    <Label htmlFor="product-name" className="block text-lg font-medium mb-1">Product Name</Label>
    <TextInput name='name' placeholder="Enter product name here" size="sm" className="w-full p-2 border rounded"  onChange={(e) => handleChange(e)}/>
  </div>

  {/* Product Code */}
  <div className="mb-4 flex items-center space-x-2">
    <Label htmlFor="product-code" className="text-lg font-medium">Product Code</Label>
    <TextInput name="prodCode" placeholder="Enter product code here" size="sm" className="w-2/3 p-2 border rounded" onChange={(e) => handleChange(e)} />
    <Button className=" bg-blue-500 text-white rounded">Auto Gen</Button>
  </div>

  {/* SKU */}
  <div className="mb-4 flex items-center space-x-2">
    <Label htmlFor="sku" className="text-lg font-medium">Stock Keeping Unit (SKU)</Label>
    <TextInput name="sku" placeholder="Enter SKU here" size="sm" className="w-2/3 p-2 border rounded" onChange={(e) => handleChange(e)}/>
    <Button className=" bg-blue-500 text-white rounded">Auto Gen</Button>
  </div>

  {/* Price */}
  <div className="mb-4">
    <Label htmlFor="price" className="block text-lg font-medium mb-1">Price</Label>
    <span className="font-bold">{!currency?'Error':currency}</span>
    <TextInput  name="price" type="number" placeholder="Enter product price" className="w-full p-2 border rounded" onChange={(e) => handleChange(e)}/>
  </div>

  {/* Discount */}
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <Label htmlFor="discount" className="block text-lg font-medium mb-1">Discount</Label>
      <span className="font-bold">{!currency?'Error':currency}</span>
      <TextInput  name="discount" type="number" placeholder="Enter discount amount" className="w-full p-2 border rounded" onChange={(e) => handleChange(e)}/>
    </div>

    {/* {Discount Type} */}
    <div>
      <Label htmlFor="discount-type" className="block text-lg font-medium mb-1">Discount Type</Label>
      <select name="discountType" className="w-full p-2 border rounded" onChange={(e) => handleChange(e)} defaultValue={'percent'}>
        <option value="percent">Percent</option>
        <option value="flat">Flat</option>
      </select>
    </div>
  </div>

  {/* Stock */}
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div>
      <Label htmlFor="stock" className="block text-lg font-medium mb-1">Stock</Label>
      <TextInput name="inStock"  type="number" placeholder="Enter stock quantity" className="w-full p-2 border rounded" onChange={(e) => handleChange(e)} />
    </div>
    <div>
      <Label htmlFor="stock-alert" className="block text-lg font-medium mb-1">Stock Alerting</Label>
      <select name="stockAlert" className="w-full p-2 border rounded" defaultValue={true} onChange={(e) => handleChange(e)}>
        <option value={true} >True</option>
        <option value={false} >False</option>
      </select>
    </div>
  </div>

  {/* Stock Alert Threshold */}
  <div className="mb-4">
    <Label htmlFor="stock-threshold" className="block text-lg font-medium mb-1">Stock Alert Threshold</Label>
    <TextInput name="stockAlertLimit"  type="number" placeholder="Enter alert threshold" className="w-full p-2 border rounded" onChange={(e) => handleChange(e)}/>
  </div>

  {/* Units */}
  <div className="mb-4">
    <Label htmlFor="units" className="block text-lg font-medium mb-1">Units</Label>
    <TextInput name="units"  placeholder="E.g., kg, piece (singular)" className="w-full p-2 border rounded" onChange={(e) => handleChange(e)}/>
  </div>

  {/* Category */}
  <div className="mb-4">
    <Label htmlFor="category" className="block text-lg font-medium mb-1">Category</Label>
    <TextInput name="category" placeholder="Major product category" className="w-full p-2 border rounded" onChange={(e) => handleChange(e)}/>
  </div>

  <div className="flex flex-wrap space-x-2">
    <div>
    <Button onClick={() => updateProduct()} color='success'>Update Product</Button>
    </div>

    <div>
    <Button onClick={() => deleteProduct()}  color = 'warning'>Delete Product</Button>
    </div>

    <div>
    <Button  onClick={() => setOpenState(false)} color="failure">Cancel</Button>
    </div>
  </div>

             </Modal.Body>
        </Modal>
        }
        
        </>
    )
}

export default EditModal