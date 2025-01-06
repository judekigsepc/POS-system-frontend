import { Card,Button } from "flowbite-react"
import CollectionDisplay from "./CollectionDisplay"
import CreateCollection from "./CreateCollection"

function CollectionManagement () {
    return (
        <>
        <div>
        <h1 className="text-2xl text-center font-bold"> Your collections</h1>
          <CreateCollection/>
          <CollectionDisplay/>
        </div>
        </>
    )
}

export default CollectionManagement
