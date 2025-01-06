import { useEffect, useState } from "react";
import { apiUrl, deleteRecord, getSingleRecord } from "../assets/functions";
import { Link, useParams } from "react-router-dom";
import { currency } from "../assets/utils";
import { Button, Card } from "flowbite-react";
import { eventEmitter } from "../assets/events";

import CollectionEditModal from "./CollectionEditModal";

function SingleCollectionView() {
  const { id } = useParams();
  const [collection, setCollection] = useState("");
  const [products, setProducts] = useState([]);
  const [collectionEditModalOpen, setCollectionEditModalOpen] = useState(false);

  useEffect(() => {
    getCollectionData();
  }, []);

  useEffect(() => {
    if (collection) {
      Promise.all(
        collection.items.map(async (productId) => {
            const { result } = await getSingleRecord("products", productId);
            return result;
        })
      ).then((data) => setProducts(data)).catch((err) => console.log(err));
    }
  }, [collection]);

  const getCollectionData = async () => {
    const { result } = await getSingleRecord("collections", id);
    setCollection(result);
  };

  const deleteCollection = async (id) => {
    await deleteRecord("collections", id);
    eventEmitter.emit("trigger-refresh");
  };

  return (
    <div className="m-8">
      <h1 className="text-xl font-bold">Single Collection View</h1>
      {!collection ? (
        "Loading..."
      ) : (
        <div>
          <div
            style={{ backgroundColor: collection.color }}
            className="w-20 h-20 rounded-full"
          ></div>
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          <p> Description: {collection.description}</p>
          <p>Saleable: {collection.saleable ? "Yes" : "No"}</p>
          <p>
            Value: {currency} {collection.priceValue.toLocaleString()}
          </p>
          <p>
            Discount: {collection.discount}{" "}
            {collection.discountType === "percent" ? "%" : "(flat)"}
          </p>
          <p>Items: {collection.items.length}</p>

          <div className="flex flex-wrap space-x-2">
            <p>
              <Button onClick={() => setCollectionEditModalOpen(true)}>
                Edit Collection
              </Button>
            </p>
            <p>
              <Button color="failure" onClick={() => deleteCollection(collection._id)}>
                <Link to="../products/collections">Delete Collection</Link>
              </Button>
            </p>
          </div>

            <CollectionEditModal
              products={products}
              collection={collection}
              modalOpen={collectionEditModalOpen}
              setModalOpen={setCollectionEditModalOpen}
              refresh={getCollectionData}
            />

          <div className="flex flex-wrap space-x-2">
            {products.length < 1
              ? "Loading..."
              : products.map((product, index) => {
                  return (
                    <Card key={index} className="max-w-sm">
                      <img
                        src={`${apiUrl}/${product.imgUrl}`}
                        className="w-20 h-20 object-cover"
                      ></img>
                      <h2>{product.name}</h2>
                      {currency} {product.price.toLocaleString()}
                    </Card>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleCollectionView;
