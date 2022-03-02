import React,{useState,useEffect}  from  "react";
import { auth } from '../../firebase';
import {toast} from 'react-toastify'
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";




const RegisterComplete = ({history}) => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('')
// const {user} = useSelector((state)=> ({...state}))

let dispatch = useDispatch();

useEffect(()=>{
    setEmail(window.localStorage.getItem('emailForRegistration'))
},[history])

const hnadleSubmit =  async (e) =>{
  e.preventDefault();
  // validation
    if(!email || !password)
    {
        toast.error('Email and Password is required')
        return;
    }

    if(password.length < 6)
    {
        toast.error("Password must be atleast 6 characters long")
        return;
    }

  
  try{
        const result = await auth.signInWithEmailLink(email,window.location.href)
        // console.log(result)
    if(result.user.emailVerified)
    {
        // remove email from local storage
        window.localStorage.removeItem('emailForRegistration');
        // get user id token 
        let user = auth.currentUser
        await user.updatePassword(password)
        const idTokenResult = await user.getIdTokenResult()
       console.log('user',user, 'idToken', idTokenResult)
        // redux store

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
    
        })
        .catch(err => console.log(err));



       
        // redirect
        history.push('/')
        

    }
    }catch(error)
  {
    console.log(error.message)
    toast.error(error.message)
  }
   
}

const completeRegistrationForm = () => <form onSubmit={hnadleSubmit}>
 <input type="email" 
    className="form-control mb-3"
    value={email}
    disabled
/>

<input type="password" 
    className="form-control"
    value={password}
    onChange={(e)=> setPassword(e.target.value)}
    autoFocus
    placeholder="Enter your password"
/>
<button 
    type="submit" 
    className=" btn btn-primary mt-3" >
        Complete Registration
</button>
</form>
    return (

        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Registration</h4>
                    
                  {completeRegistrationForm()}
                </div>
            </div>
        </div>
    )
}

export default RegisterComplete;