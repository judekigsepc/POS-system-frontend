import { useEffect, useState } from "react"
import { getAllRecords } from "../assets/functions"
import { Card,Button } from "flowbite-react"
import { currency } from "../assets/utils"
import { Link } from "react-router-dom"
import { eventEmitter } from "../assets/events"

function CollectionDisplay () {
    const [collections, setCollections] = useState('')

    useEffect(() => {
        getCollections()
    },[])

    const getCollections = async () => {
            const {result} = await getAllRecords('collections')
            console.log(result)
            setCollections(result)
    }

    eventEmitter.on('trigger-refresh',async () => {
            await getCollections()
    })


    return (
        <>
        <div className="flex flex-wrap p-8 space-x-2">
            {
                !collections?'No collections to display':collections.map((collection,index) => {
                    const style = {backgroundColor: collection.color}

                    return(
                        <Card className='max-w-sm text-black' key={index} style={style}>
                   <h5 className="text-2xl font-bold text-black">
                      {collection.name}
                    </h5>
                   <p className="font-normal text-black">
                    {collection.description}
                    </p>
                    <span>{currency} {collection.priceValue}</span>
                    {collection.items.length} products
                   <Button> 
                   <Link to={`${collection._id}`}>View Collection</Link>
                    </Button>
                    </Card>
                    )
                })
            }
        
        </div>
        </>
    )
}

export default CollectionDisplay
