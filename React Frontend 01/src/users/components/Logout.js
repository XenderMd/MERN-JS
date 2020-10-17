import React, {useContext } from "react";


import {AuthContext} from '../../shared/context/auth-context';


const Logout = ()=>{

    const auth = useContext(AuthContext);
    auth.logout();
    return(null)
}

export default Logout;