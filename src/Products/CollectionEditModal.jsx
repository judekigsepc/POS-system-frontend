import { Modal, Label, TextInput, Textarea, Button, Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { currency } from "../assets/utils";
import { updateNonFormDataRecord, calculateCollection, handleCollectionResult } from "../assets/functions";
import ProductsMiniModal from "./ProductsMiniModal";
import { eventEmitter } from "../assets/events";

function CollectionEditModal({ collection, products, modalOpen, setModalOpen, refresh}) {
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [collectionDiscountData, setCollectionDiscountData] = useState({
    discount: 0,
    discountType: "percent",
  });
  const [collectionPriceData, setCollectionPriceData] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    collectionCode: "",
    description: "",
    stockAlert: true,
    stockAlertLimit: 0,
    saleable: true,
    discount: 0,
    discountType: "percent",
    color: "",
    items: [],
    priceValue: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateCollection = async () => {
    const prunedData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== "" && formData[key] !== null) acc[key] = formData[key];
      return acc;
    }, {});

    await updateNonFormDataRecord("collections", collection._id, prunedData);
    closeModal()
  };

  const closeModal = () => {
    setModalOpen(false);
    setCollectionProducts(products);
    setCollectionDiscountData({ discount: 0, discountType: "percent" });
    setCollectionPriceData(0);
    setFormData({
      name: "",
      collectionCode: "",
      description: "",
      stockAlert: true,
      stockAlertLimit: 0,
      saleable: true,
      discount: 0,
      discountType: "percent",
      color: "",
      items: [],
      priceValue: 0,
    });
    refresh()
  };

  useEffect(() => {
   
      setFormData((prev) => ({
        ...prev,
        items: collectionProducts.map((product) => product._id),
        discountType: collectionDiscountData.discountType,
        discount: collectionDiscountData.discount,
        priceValue: collectionPriceData,
      }));

      calculateCollection(collectionProducts, collectionDiscountData);
    
  }, [collectionProducts, collectionDiscountData]);

    handleCollectionResult((result) => {
      console.log(result)
      setCollectionPriceData(result);
    });
  

  useEffect(() => {
    if (products) setCollectionProducts(products);
  }, [products]);

  return (
    <>
      {!collection ? (
        <p>ERROR: Collection not found</p>
      ) : (
        <Modal show={modalOpen} onClose={closeModal}>
          <Modal.Header>Edit {collection.name} Collection</Modal.Header>
          <Modal.Body>
            <div>
              <Label>Collection Name</Label>
              <TextInput name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="flex space-x-2 mt-4">
              <Label>Collection Code</Label>
              <TextInput name="collectionCode" value={formData.collectionCode} onChange={handleChange} />
              <Button>Auto Gen</Button>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div>
              <Label>Stock Alerting</Label>
              <select
                name="stockAlert"
                value={formData.stockAlert}
                onChange={handleChange}
              >
                <option value={true}>ON</option>
                <option value={false}>OFF</option>
              </select>
            </div>

            <div className="flex space-x-2 mt-4">
              <Label>Stock Alert Threshold</Label>
              <TextInput
                name="stockAlertLimit"
                type="number"
                value={formData.stockAlertLimit}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Saleable</Label>
              <select
                name="saleable"
                value={formData.saleable}
                onChange={handleChange}
              >
                <option value={true}>YES</option>
                <option value={false}>NO</option>
              </select>
            </div>

            <div className="flex space-x-2 mt-4">
              <Label>Discount</Label>
              <TextInput
                type="number"
                value={collectionDiscountData.discount}
                onChange={(e) =>
                  setCollectionDiscountData((prev) => ({ ...prev, discount: e.target.value }))
                }
              />

              <Label>Type</Label>
              <select
                value={collectionDiscountData.discountType}
                onChange={(e) =>
                  setCollectionDiscountData((prev) => ({ ...prev, discountType: e.target.value }))
                }
              >
                <option value="percent">Percent</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            <div className="flex space-x-2 mt-4">
              <Label>Color</Label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-2 mt-4">
              <Label>Products</Label>
              <Button onClick={() => setProductModalOpen(true)}>Choose products</Button>
            </div>

            <div>
              <Table>
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Discount</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {collectionProducts.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={4}>No products in collection</Table.Cell>
                    </Table.Row>
                  ) : (
                    collectionProducts.map((product, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>
                          {currency} {product.price.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>
                          {product.discount.toLocaleString()} {product.discountType === "percent" ? "%" : "(flat)"}
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            color="failure"
                            size="xs"
                            onClick={() =>
                              setCollectionProducts((prev) =>
                                prev.filter((_, prodIndex) => prodIndex !== index)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}

                  {collectionPriceData > 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={3}>Total</Table.Cell>
                      <Table.Cell className="font-bold">
                        {currency} {collectionPriceData.toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </div>

            <ProductsMiniModal
              modalOpen={productModalOpen}
              setModalOpen={setProductModalOpen}
              addProduct={setCollectionProducts}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button color="success" onClick={updateCollection}>
              Save
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default CollectionEditModal;
