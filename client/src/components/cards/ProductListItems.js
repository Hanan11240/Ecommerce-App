import React from 'react'
import { Link } from 'react-router-dom'

const ProductListItems = ({product})=>{
const {price,category,subs,shipping,color,brand,sold,quantity} = product;
    return(
    <ul className="list-group">
        <li className="list-group-item">
            Price <span className="label">
                ${price}
                </span>
        </li>
        
        { category &&( <li className="list-group-item">
            Category{" "}
            <Link to={`/category/${category.slug}`} className="label">
                {category.name}
                </Link>
        </li>)}
        
            {subs && (
                <li className="list-group-item">
                    Sub Categories {subs.map((s)=> 
                    <Link
                        key={s._id}
                        to={`/sub/${s.slug}`} className="label">
                        {s.name}
                    </Link>
                    )}
                </li>
            )}

        
        
        <li className="list-group-item">
            Shipping {" "} 
            <span className="label">
                {shipping}
                </span>
        </li>
        
        <li className="list-group-item">
            Color{" "} 
            <span className="label">
                {color}
                </span>
        </li>
        
        <li className="list-group-item">
            Brand  
            <span className="label">
                {brand}
                </span>
        </li>
        
        <li className="list-group-item">
            Available {" "}
            <span className="label">
                {quantity}
                </span>
        </li>

        <li className="list-group-item">
            Sold {" "}
            <span className="label">
                {sold}
                </span>
        </li>

    </ul>
    )
}

export  default ProductListItems;