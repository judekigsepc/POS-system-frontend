import {BrowserRouter,Routes, Route} from 'react-router-dom'

import Home from './Home'
import Nav from './Nav'
import AlertBar  from './Alert'

import Sale from './Sales/Sale'
import AddProduct from './Products/AddProduct'
import StockManager  from './Products/StockManager'

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
      <Route path='/product/add' element={<AddProduct/>}></Route>
      <Route path='/product/stock' element={<StockManager/>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
    
    </>
  )
}

export default App