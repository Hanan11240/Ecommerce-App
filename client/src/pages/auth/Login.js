import React,{useState,useEffect}  from  "react";
import { auth, googleAuthProvider } from '../../firebase';
import {toast} from 'react-toastify'
import {Button} from 'antd'
import { MailOutlined,GoogleOutlined}   from '@ant-design/icons';
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";




const Login = ({history}) => {
const [email, setEmail] = useState('peerhanan11240@gmail.com');
const [password, setPassword] = useState('1234567890');
const [loading,setLoading] = useState(false);
const {user} = useSelector(state => ({...state}))

let dispatch = useDispatch();





useEffect(()=>{
  let intended = history.location.state;
  if(intended) 
  {
    return;
  }
  else {
    if(user && user.token) history.push('/')
    
  }
  
},[user,history])



const roleBasedRedirect = (res) => {
//  check if intended
let intended = history.location.state;
if(intended){
  history.push(intended.from); 

}
else {
  if(res.data.role === 'admin') {
    history.push('/admin/dashboard');
  }
  else {
    history.push('/user/history');
  }
}

};


const hnadleSubmit =  async (e) =>{
  e.preventDefault();
  setLoading(true);

//   console.table(email,password)
  try {
     const result = await auth.signInWithEmailAndPassword(email,password)
    //  console.log(result);
    const {user} =result;
    const idTokenResult = await user.getIdTokenResult();

    createOrUpdateUser (idTokenResult.token)
    .then(res =>{

      dispatch({ 
        type:"LOGGED_IN_USER",
        payload: {
          name:res.data.name,
          email: res.data.email,
          token: idTokenResult.token,
          role:res.data.role,
          _id: res.data._id,
        }
      });
      roleBasedRedirect(res);

    })
    .catch(err => console.log(err));

    
      // history.push('/')
      


  }catch(error)
  {
    toast.error(error.message)
    setLoading(false)
  }
    
    }

const googleLogin = async () =>{
    // 

    auth.signInWithPopup(googleAuthProvider)
    .then(async(result)=>{
            const {user} = result;
            const idTokenResult = await user.getIdTokenResult();
            
            createOrUpdateUser (idTokenResult.token)
            .then(res =>{
        
              dispatch({
                type:"LOGGED_IN_USER",
                payload: {
                  name:res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role:res.data.role,
                  _id: res.data._id,
                }
              });

              roleBasedRedirect(res)
        
            })
            .catch(err => console.log(err));

              // history.push("/");
    })
    .catch(error =>{
        toast.error(error.message)
    })
}


const loginForm = () => <form onSubmit={hnadleSubmit}>
 <input type="email" 
    className="form-control mb-3"
    value={email}
    onChange={(e)=> setEmail(e.target.value)}
    placeholder="Enter your email"
/>
<input type="password" 
    className="form-control"
    value={password}
    onChange={(e)=> setPassword(e.target.value)}
    placeholder="Enter your password"
/>
  <Button 
       onClick={hnadleSubmit}
       type="primary"
       className="mt-3 mb-3"
       block
       shape="round"
       icon={< MailOutlined/>}
        size="large"
        disabled={!email || password.length < 6 }
       >
      Login with Email/Password
  </Button>
</form>
    return (

        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                {loading ? <h4 className="text-danger">Loading...</h4>:<h4>Log In</h4>}
                    
                  {loginForm()}

                  <Button 
                    onClick={googleLogin}
                    type="danger"
                    className="mt-3 mb-3"
                    block
                    shape="round"
                    icon={< GoogleOutlined/>}
                    size="large"
                >
                    Login with Google
                </Button>
                <Link to="/forgot/password" className="float-end text-danger">
                    Forgot Password
                </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;