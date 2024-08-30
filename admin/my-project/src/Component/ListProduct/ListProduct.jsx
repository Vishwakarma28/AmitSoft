import { useEffect, useState } from "react"
import cross_icon from "../../assets/cross_icon.png"


const ListProduct = () => {

  const [allProducts,setAllProducts] = useState([]);

  const fetchInfo = async()=>{
    await fetch('http://localhost:4000/allproducts')
    .then((res)=>res.json())
    .then((data)=>{setAllProducts(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[])

  const remove_product = async(id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json'
      },
       body:JSON.stringify({id:id})
    })
    await fetchInfo();
  }

  return (
    <div className='List-Product flex flex-col items-center w-full h-full py-2 px-12 m-7 rounded-md bg-white'>
      <h1 className="text-3xl font-medium">All Product List</h1>
      
      <div className=" list-product-format-main grid  w-full py-5 px-0 text-sm  text-slate-600
            items-center font-medium">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="ListProduct-allProducts">
        <hr />
        {allProducts.map((product,index)=>{
          
            return<><div key={index} className=" listProduct-format list-product-format-main grid gap-2 w-full py-5 px-0 text-sm font-semibold text-slate-600
            
            ">
              <img src={product.image} alt="" className="h-20" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{remove_product(product.id)}} src={cross_icon} alt="" className="cursor-pointer " />
            </div>
            <hr />
            </> 
        })}
      </div>
    </div>
  )
}

export default ListProduct
