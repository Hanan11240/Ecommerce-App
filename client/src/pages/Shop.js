import React,{useState,useEffect} from 'react';
import {getProductsByCount,fetchProductsByFilter} from '../functions/Product'
import {getCategories} from '../functions/category'
import { getSubs } from '../functions/sub'
import {useSelector, useDispatch} from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import {Menu,Slider, Checkbox} from 'antd';
import { DollarOutlined,DownSquareOutlined,StarOutlined } from '@ant-design/icons';
import Star from '../components/forms/Star'
import { Radio } from 'antd';



const {SubMenu , ItemGroup} = Menu;
const Shop  = ()  => {
    const [products,setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price,setPrice] = useState([0,0])
    const [categories,setCategories]= useState([]);
    const [categoryIds,setCategoryIds] = useState([]);
    const [star,setStar] = useState('')
    const [subs,setSubs] = useState([])
    const [sub,setSub] = useState('')
    const [colors,setColors] = useState( ["Black","Brown","Silver","White","Blue"])
    const [color,setColor] = useState('');

    let dispatch = useDispatch();
    const [ok,setOk]= useState(false)
   
    let {search} = useSelector((state)=>({...state}));
    const {text} = search;   


useEffect(()=>{
    loadAllProducts()
    //fetch categories
    getCategories().then((res)=> setCategories(res.data))
    //fetch subcategories
    getSubs().then(res => setSubs(res.data))

},[])

const fetchProducts = (arg) =>{


    fetchProductsByFilter(arg)
    .then((res)=>{
        setProducts(res.data)
    })
}



// 1. load products by default on shop page
const loadAllProducts = () => {
    getProductsByCount(12).then(p=>{
        setProducts(p.data);
        setLoading(false);
    });
};

// 2.load products on user search input
useEffect(() => {
    // console.log('load products on user search input', text)
    const delayed = setTimeout(()=>{
        fetchProducts({query: text});
        if(!text) {
            loadAllProducts();
        }
    },300)
    return () => clearTimeout(delayed);
}, [text])

// 3. load products base on price range

useEffect(()=>{
    console.log('ok to request');
    fetchProducts({price: price});
},[ok])

const handleSlider = (value) => {
    dispatch({
        type: "SEARCH_QUERY",
        payload: {test: " "}
    });

    setCategoryIds([]);
    setPrice(value);
    setStar('')
    setSub('')
    setColor('')
    setTimeout(()=>{
        setOk(!ok)

    },300);

}
// 4. load products based on category
// show categories in a list of check box
const showCategories =() => categories.map((c)=> <div key={c.id}>
        <Checkbox onChange={handleCheck}className="pb-2 ps-4 pe-4" value={c._id} name="category" checked={categoryIds.includes(c._id)}>
            {c.name}
            </Checkbox>
            <br />
     </div>)

    //  handlecheck for categories 
    const handleCheck = (e) => {
        dispatch({
            type:'SEARCH_QUERY',
            payload: {text: " "},

        });
        setPrice([0,0]);
        setStar('');
        setSub('')
        setColor('')
        // console.log(e.target.value)
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState =inTheState.indexOf(justChecked); 
            // indexOf method  if not found returns -1 else   index
            if(foundInTheState === -1 )
            {
                inTheState.push(justChecked)
            }else{
                // if found pull out one item from index
                inTheState.splice(foundInTheState,1)
            }
        setCategoryIds(inTheState);
        // console.log('inthestate-->',inTheState);
        fetchProducts({category:inTheState}) 
    }


// 5.Show Products by Star Rating

const handleStarClick = num =>{
    // console.log('num',num)
    dispatch({
        type: "SEARCH_QUERY",
        payload:{text: ""},

    });
    setPrice([0,0]);
    setCategoryIds([]);
    setSub('')
    setColor('')
    setStar(num)
    fetchProducts({stars: num});
}



const showStars = () => (
    <div className="ps-4 pe-4 pb-2">
        <Star  starClick={handleStarClick} numberOfStars={5} /> 
        <Star  starClick={handleStarClick} numberOfStars={4} /> 
        <Star  starClick={handleStarClick} numberOfStars={3} /> 
        <Star  starClick={handleStarClick} numberOfStars={2} /> 
        <Star  starClick={handleStarClick} numberOfStars={1} /> 
    </div>
)


// 6. show products by sub categories
const showSubs = () => subs.map((s)=> <div
    key={s._id}
    onClick={()=> handleSub(s)} 
    className="p-1 m-1 badge bg-primary"
    style={{cursor: 'pointer'}}
    >
        {s.name}
        </div>)

const handleSub  = sub => {
    // console.log('Submit', s)
    setSub(sub)
    dispatch({
        type: "SEARCH_QUERY",
        payload:{text: ""},

    });
    setPrice([0,0]);
    setCategoryIds([]);
    setStar('')
    setColor('')
    fetchProducts({sub: sub});
}


// 7. Show products based on color
const showColors = ()=> 
    colors.map((c)=>
    <Radio
        key={c}
         value={c}
         name={c}
         checked={c===color}
         onChange={handleColor}
         className="pb-1 ps-4 pe-4"
    >
        {c}
    </Radio>

)
const handleColor = (e) =>{
    setSub("");
    dispatch({
        type:"SEARCH_QUERY",
        payload:{text: ""},
    });
    setPrice([0,0]);
    setCategoryIds([]);
    setStar('')
    setColor(e.target.value)
    fetchProducts({color:e.target.value})
}

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <hr />
                    <Menu defaultOpenKeys={['1','2','4']}mode="inline">
                        {/* price */}
                        <SubMenu key="1" title={
                        <span className="h6">
                            <DollarOutlined /> Price
                        </span>
                    }>
                            <div>
                                <Slider className="ms-4 me-4" 
                                    tipFormatter={(v)=>`$${v}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max="100000"
                                />
                            </div>
                        </SubMenu>

                                {/* category */}
                        <SubMenu key="2" title={
                        <span className="h6">
                            <DownSquareOutlined /> Categories
                        </span>
                    }>
                            <div style={{marginTop: "-10px"}}>
                            {showCategories()}
                            </div>
                        </SubMenu>


                        {/* Stars */}
                        <SubMenu key="3" title={
                        <span className="h6 mb-5">
                            <StarOutlined /> Rating
                        </span>
                    }>
                            <div style={{marginTop: "-10px",height:"50px",overflow:'scrollY'}}>
                            {showStars()}
                            </div>
                        </SubMenu>

                        {/* Sub Category */}

                        <SubMenu key="4" title={
                        <span className="h6 ">
                            <DownSquareOutlined /> Sub Categories
                        </span>
                    }>
                            <div style={{marginTop: "-10px"}} className="pe-4 ps-4">
                            {showSubs()}
                            </div>
                        </SubMenu>

                        {/* colors */}
                        <SubMenu key="5" title={
                        <span className="h6">
                            <DownSquareOutlined /> Colors
                        </span>
                    }>
                            <div style={{marginTop: "-10px"}}>
                            {showColors()}
                            </div>
                        </SubMenu>

                    </Menu>

                </div>
                <div className="col-md-9 pt-2">
                    {loading ? (
                        <h4 className="text-danger">Loading</h4>
                    ) : (
                            <h4>Products</h4>
                    ) }

                    {products.length < 1 && <p>No products found</p> }

                    <div className="row pb-5">
                        {products.map((p)=>(
                        <div key={p._id} className="col-md-4 mt-3">
                                <ProductCard  product={p}/>
                        </div>))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Shop; 