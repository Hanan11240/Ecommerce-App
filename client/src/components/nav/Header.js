import React,{useState}from "react";
import { Menu ,Badge} from 'antd';
import { 
  UserOutlined,
   SettingOutlined,
   AppstoreOutlined,
   UserAddOutlined ,
   LogoutOutlined,
   ShoppingOutlined,
   ShoppingCartOutlined,
  } 
  from '@ant-design/icons';
import { Link } from "react-router-dom";
import firebase from "firebase";
import { useDispatch , useSelector} from "react-redux";
import { useHistory } from "react-router";
import Search from '../forms/Search'







const { SubMenu } = Menu;

const Header = () => {
const [current, setCurrent] = useState('home');
const history = useHistory();                                                                                                          
let dispatch = useDispatch();

let {user,cart} = useSelector((state)=> ({ ...state }))

const handleClick = (e) =>{
    // 
    // console.log(e.key)
    setCurrent(e.key);
}       

const logout = () =>{                                             
  firebase.auth().signOut()

  dispatch({
    type:"LOGOUT",
    payload: null,
  })
  history.push("/login")
}

 return (

    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
    <Menu.Item key="home" icon={<AppstoreOutlined />}>
      <Link to ="/">Home</Link>
    </Menu.Item>


    <Menu.Item key="shop" icon={<ShoppingOutlined />}>
      <Link to ="/shop">Shop</Link>
    </Menu.Item>
    
    <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
      <Link to ="/cart">
        <Badge count={cart.length} offset={[12,0]}>
          Cart
        </Badge>
      </Link>
    </Menu.Item>

 

    {!user && (
      <Menu.Item key="register" icon={<UserAddOutlined />}>
      <Link to="/register">Register</Link>
    </Menu.Item>
    )}

{!user && (
      <Menu.Item key="login" icon={<UserOutlined />} >
      <Link to="/login">Login</Link>
    </Menu.Item>
  )}
    
   {user && (
      <SubMenu key="SubMenu" icon={<SettingOutlined />} title={user.email && user.email.split('@')[0] }>
     
      {user && user.role === 'subscriber' && 
      (
      <Menu.Item>
        <Link to ="/user/history">Dashboard</Link>
        </Menu.Item>)}

        {user && user.role === 'admin' && 
      (
      <Menu.Item>
        <Link to ="/admin/dashboard">Dashboard</Link>
        </Menu.Item>)}


      <Menu.Item key="setting:3"icon={<LogoutOutlined /> }onClick={logout}>Logout</Menu.Item>
    
  </SubMenu>
   )}

   <span className="p-1 ">
     <Search />
   </span>

    
  </Menu>
 )
}


export default Header;