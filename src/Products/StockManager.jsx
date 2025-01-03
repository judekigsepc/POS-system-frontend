import StockDisplay from "./StockDisplay"
import { useState } from "react"

function StockManager () {
    const [productId, setProductId] = useState('')
    
    const onManageClick = (id) => {
        setProductId(id)
    }

    return (
        <>
        <div className="">
                <StockDisplay onManageClick = {(id) => onManageClick(id)}/>
            </div>
       
        </>
    )
}

export default StockManager