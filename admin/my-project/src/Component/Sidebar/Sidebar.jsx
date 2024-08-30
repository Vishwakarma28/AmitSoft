
import {Link} from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar flex flex-col pt-7 gap-5  bg-slate-100' style={{width:"100%","max-width":"250px",height:"100vh"}}>
      <Link to={'/addproduct'} state={{textDecoration:"none"}} >
        <div className='sidebar-item flex items-center justify-center my-0 mx-5 py-1 px-2 rounded bg-slate-200 gap-5 cursor-pointer'>
            <img src={add_product_icon} alt="" />
            <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/listproduct'} state={{textDecoration:"none"}} >
        <div className='sidebar-item flex items-center justify-center my-0 mx-5 py-1 px-2 rounded bg-slate-200 gap-5 cursor-pointer'>
            <img src={ list_product_icon} alt="" />
            <p> Product List</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar
