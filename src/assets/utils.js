import { getAllRecords } from "./functions";

let currency
 const getCurrency = async () => {
    const {result} = await getAllRecords('config')
    currency = result.currency
}


getCurrency()

export {
    currency
}