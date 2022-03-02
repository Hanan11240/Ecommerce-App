import React from "react"
import {Route} from 'react-router-dom'
import { useSelector } from "react-redux"
import LoadingToRedirect from './LodingToRedirect'

const UserRoute = ({children, ...rest}) => {

    const {user} = useSelector((state)=>({...state}));
    
    return user && user.token ? (
    <Route {...rest}  />) : (
        <LoadingToRedirect /> )

}

export default UserRoute;