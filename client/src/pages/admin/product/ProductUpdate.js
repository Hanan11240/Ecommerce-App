import React,{useState,useEffect} from 'react'
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {getProduct ,updateProduct} from '../../../functions/Product';
import {getCategories,getCategorySubs  } from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import {LoadingOutlined} from '@ant-design/icons'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';


const initialState = {
    title: '',
    description: '',
    price: '',
    category:  '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ["Black","Brown","Silver","White","Blue"],
    brands: ["Apple","Samsung","Microsoft","Lenovo","Asus","Xiaomi","Vivo"],
    color: '',
    brand:'',
}


const ProductUpdate = ({ match,history }) => {
// state
const [values,setValues] = useState(initialState);
const[subOptions,setSubOPtions] = useState([]);
const [categories,setCategories] = useState([]);
const [arrayOfSubs,setArrayOfSubs] = useState([])
const [selectedCategory,setSelectedCategory] = useState('');
const [loading,setLoading] = useState(false);





const { user } = useSelector((state)=> ({...state}));
const { slug } = match.params;


useEffect(()=>{
    loadProduct()
    loadCategories()
},[])

const loadProduct = () => {
    getProduct(slug)
    .then(p => {
        // console.log('single product',p)
        // 1. load single product

        setValues({...values, ...p.data})
        //2. load single product category subs
        getCategorySubs(p.data.category._id)
        .then((res)=>{
            setSubOPtions(res.data); // on first load show default subs
        });
        // 3. prepare array of sub ids to show as default sub values in antd design select
        let arr = []
        p.data.subs.map(s=> {
            arr.push(s._id); 
        });
        console.log("Arr",arr)
        setArrayOfSubs((pre) => arr); //required for ant design select to work
    });
};

const loadCategories = () => 
getCategories().then((c) => {
    console.log('Get Categories in update', c.data);
    setCategories(c.data);
});


const handleSubmit =(e) =>{
    e.preventDefault()
    setLoading(true);
    values.subs = arrayOfSubs;
    values.category = selectedCategory ? selectedCategory: values.category;

    updateProduct(slug,values, user.token)
    .then((res) =>{
        setLoading(false);
        toast.success(`${res.data.title} is updated`)
        history.push("/admin/products");
    })
    .catch((err) => {
            console.log(err);
            setLoading(false);
            toast.error(err.response.data.err);
    });
}


const handleChange = (e) => {
    // 
    setValues({...values,[e.target.name]: e.target.value});
    // console.log(e.target.name,"------",e.target.value);
}


const handleCategoryChange = (e) =>{
    e.preventDefault()
    console.log('Clicked Category',e.target.value)
    setValues({...values,subs:[]})

    setSelectedCategory(e.target.value)

    getCategorySubs(e.target.value)
    .then((res) => {
        console.log('Sub options on category click',res)
        setSubOPtions(res.data);
    });

    console.log('existing category values.category',values.category)
    //if user clicks back to the oeiginal category 
    //show its sub categories in default
    if(values.category._id === e.target.value){
        loadProduct()
    }
    //clear old sub category ids
  setArrayOfSubs([]);  
};



return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">  
            <AdminNav />
                </div>

                <div className="col-md-10">
                {loading ? (
                   <LoadingOutlined  className="text-danger h1"/>)
                    : (<h4>Product Update</h4>
                    )}
                {/* {JSON.stringify(values)} */}

                <div className="p-3">
                        <FileUpload 
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}/>
                </div>
                <br />

                <ProductUpdateForm 
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleCategoryChange={handleCategoryChange}
                    setValues={setValues}
                    values={values}
                    categories={categories}
                    subOptions={subOptions}
                    arrayOfSubs={arrayOfSubs}
                    setArrayOfSubs={setArrayOfSubs}
                    selectedCategory={selectedCategory}


                />
                    <hr />

                
                </div>
            </div>
        </div>
    )
}   

export default ProductUpdate;