import React,{useState,useEffect}from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {toast} from 'react-toastify'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { getCoupons,removeCoupon,createCoupon } from '../../../functions/coupon';
import {DeleteOutlined} from '@ant-design/icons'
import AdminNav from '../../../components/nav/AdminNav';

const CreateCouponPage = () => {
    const [name,setName] = useState('')
    const [expiry,setExpiry] = useState('')
    const [discount,setDiscount] = useState('')
    const [loading,setLoading] = useState(false)
    const [coupons,setCoupons]= useState([]);
// redux
const {user} = useSelector((state)=>({...state}));

useEffect(()=>{
getCoupons().then(res=> setCoupons(res.data))
},[])



const handleSubmit = (e) =>{
    e.preventDefault();
    setLoading(true)
    // console.table(name,expiry,discount);
    createCoupon({name,expiry,discount},user.token)
    .then(res=> {
        setLoading(false)
        getCoupons().then(res=> setCoupons(res.data))
        setName('')
        setDiscount('')
        setExpiry('')
        toast.success(`${res.data.name} is created`)
    }).catch(err => console.log('create coupon error'))
}


const handleRemove = couponId =>{
    if(window.confirm('Delete')){
        removeCoupon(couponId,user.token)
        .then(res =>{
            getCoupons().then((res)=> setCoupons(res.data));
            setLoading(false);  
            toast.error(`Coupon "${res.data.name}" deleted`);
        })
        .catch((err)=> console.log(err));
    }
}

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">  
                    <AdminNav />
                </div>
                <div className="col-md-10">
               {loading ? <h4 className="text-danger">Loading...</h4>:<h4>Coupon</h4>}

                <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label className="text-muted">Name</label>
                            <input 
                                type="text"  
                                className="form-control" 
                                onChange={(e)=>setName(e.target.value)}
                                value={name}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Discount %</label>
                            <input 
                                type="text"  
                                className="form-control" 
                                onChange={(e)=>setDiscount(e.target.value)}
                                value={discount}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted">Exipry</label>
                            <br />
                            <DatePicker  
                                className="form-control"
                                selected={new Date()}
                                value={expiry}
                                required
                                onChange={(date)=>setExpiry(date)}
                            />
                        </div>
                        <button className="btn btn-primary mt-3">Create</button>
                </form>
                <br />
                <h4>{coupons.length} Coupans</h4>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Expiry</th>
                            <th scope="col">Discount</th>
                            <th scope="col">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((c)=> <tr key={c._id}>
                                <td>{c.name}</td>
                                <td>{new Date(c.expiry).toLocaleDateString()}</td>
                                <td>{c.discount}%</td>
                                <td>
                                    <DeleteOutlined 
                                        className="text-danger pointer"
                                        onClick={()=>handleRemove(c._id)}
                                   />
                                </td>


                        </tr>)}
                    </tbody>
                </table>
                </div>
            </div>
          
        </div>
    )
}


export default CreateCouponPage;