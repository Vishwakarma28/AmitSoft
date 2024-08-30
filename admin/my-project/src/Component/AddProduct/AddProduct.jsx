import { useState } from 'react'
import upload_area from '../../assets/upload_area.svg'


const AddProduct = () => {

    
    const [image,setImage] = useState(false);
    const [productDelails,setProductDelails] = useState({
        name:"",
        image:"",
        category:"woman",
        new_price:"",
        old_price:""
    })
    const changeHandler = (e)=>{
        setProductDelails({...productDelails,[e.target.name]:e.target.value})
    }

    const imageHandler = (e)=>{
        setImage(e.target.files[0]);
    }

    const Add_product = async ()=>{
        console.log(productDelails);
        let responseData;
        let product = productDelails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'Application/json',
            },
            body:formData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data});

        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'Application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("product added"):alert("Failed")
            })
        }
        
    }

  return (
    <div className='AddProduct box-border w-full max-w-full py-7 px-12 my-5 mx-7 rounded bg-white'>
      <div className="addproduct-itemfield w-full text-slate-300 text-base">
        <p>Product title</p>
        <input value={productDelails.name} onChange={changeHandler} type="text" name="name" placeholder="Type here" className='box-border w-full h-12 rounded pl-4 border-solid border-2 border-slate-400  text-slate-400 text-sm'/>
      </div>

        <div className="addproduct_price flex gap-4 ">
            <div className="addproduct-itemfield w-full text-slate-300 text-base">
                <p>Price</p>
                <input value={productDelails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here" className='box-border w-full h-12 rounded pl-4 border-solid border-2  border-slate-400  text-slate-400 text-sm '/>
            </div>
            <div className="addproduct-itemfield w-full text-slate-300 text-base">
                <p>Offer-Price</p>
                <input value={productDelails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here" className='box-border w-full h-12 rounded pl-4 border-solid border-2  border-slate-400  text-slate-400 text-sm'/>
            </div>
        </div>
      <div className="addproduct-itemfield w-full text-slate-300 text-base">
        <p>Product Category</p>
        <select onChange={changeHandler} name="category" className="add-product-selector p-2 w-24 h-12 text-sm text-slate-600 rounded">
            <option value="woman">woman</option>
            <option value="man">man</option>
            <option value="kid">kids</option>
        </select>
      </div>
      <div className="addproduct-itemfield w-full text-slate-300 text-base">
        <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_area} alt="" className='addproduct-thumnail-img w-32 h-32  rounded-xl object-contain my-2 mx-0' />
        </label>
        <input onChange={imageHandler} type='file' name='image' id='file-input' hidden className='box-border w-full h-12 rounded pl-4 border-solid border-2  border-slate-400  text-slate-400 text-sm'/>
      </div>
      <button onClick={()=>{Add_product()}} className='addproduct-btn mt-5 w-40 h-12 rounded-md bg-blue-500 border-none cursor-pointer text-white text-base font-medium'>ADD</button>
    </div>
  )
}

export default AddProduct
