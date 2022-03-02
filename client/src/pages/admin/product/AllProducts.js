import React,{useState,useEffect}from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { getProductsByCount } from '../../../functions/Product'
import AdminProductCard from '../../../components/cards/AdminProductCard'
import { removeProduct } from '../../../functions/Product'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'

 


const AllProducts = () => {
const [products,setProducts] = useState([])
const [loading,setLoading] = useState(false);
// redux
const {user} = useSelector((state)=> ({...state}))


useEffect(()=>{
   loadAllProducts()
},[])

const loadAllProducts  = () => {
    getProductsByCount(10)
    // .then((res) => console.log(res.data))
    .then((res)=> {
        setLoading(true)
        setProducts(res.data)
        setLoading(false) 
    })
    .catch((err) => {
        setLoading(false)
        console.log(false)
    })
}

    const handleRemove =(slug) =>{
        let answer = window.confirm('Delete?');
        if(answer) {
            // console.log('send delete request',slug)
            removeProduct(slug,user.token)
            .then((res) => {
                loadAllProducts();
                toast.success(`${res.data.title} is deleted.`)
            })
            .catch((err) => {
                if (err.response.status === 400) toast.error(err.response.data)
                console.log(err)
            })
        }
    };

    return(
        <div className="container-fluid">
        <div className="row">
            <div className="col-md-2">
                <AdminNav />  
            </div>
            
            <div className="col">  
            {loading? (<h4 className="text-danger">Loading...</h4> ) : (<h4>All Products</h4>)}
              
               <div className="row">
               {products.map((product) => (
                
                <div className="col-md-4 pb-3" key={product._id}>
                    <AdminProductCard  product={product} 
                    handleRemove={handleRemove} />
                </div>
                
                ))}
               </div>
            </div>
        </div>
    </div>
    )
}

export default AllProducts