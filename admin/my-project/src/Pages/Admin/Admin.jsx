import AddProduct from "../../Component/AddProduct/AddProduct"
import ListProduct from "../../Component/ListProduct/ListProduct"
import Sidebar from "../../Component/Sidebar/Sidebar"
import { Routes ,Route } from "react-router-dom"



const Admin = () => {
  return (
    <div className='Admin flex'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>} />
        <Route path='/listproduct' element={<ListProduct/>} />
      </Routes>
    </div>
  )
}

export default Admin
