import {BrowserRouter,Routes, Route} from 'react-router-dom'

import Home from './Home'
import Nav from './Nav'
import AlertBar  from './Alert'

import Sale from './Sales/Sale'
import AddProduct from './Products/AddProduct'
import StockDisplay from './Products/StockDisplay'
import CollectionManagement from './Products/CollectionManagement'
import SingleCollectionView from './Products/SingleCollectionView'
import HeldSales from './Sales/HeldSales'

function App () {

  return (
    <>
     <AlertBar/>
    <div className='grid grid-cols-[15%,85%] gap-5'>
    <BrowserRouter>
    <Nav/>
    <Routes>
      <Route path='/' element={<Home/> } ></Route>
      <Route path='/sale' element={<Sale/>}></Route>
      <Route path='/holds' element={<HeldSales/>}></Route>
      <Route path='/products/add' element={<AddProduct/>}></Route>
      <Route path='/products/stock' element={<StockDisplay/>}></Route>
      <Route path='/products/collections' element={<CollectionManagement/>}></Route>
      <Route path='/products/collections/:id' element={<SingleCollectionView/>}></Route>
    </Routes>  
    </BrowserRouter>
    </div>
    
    </>
  )
}

export default App