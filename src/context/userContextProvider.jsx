import {React, useState, useContext} from "react";
import UserContext from "./userContext.js";

const UserContextProvider = ({children}) =>{
    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
    });
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    return (
        <UserContext.Provider value = {{user, setUser, isLoggedIn, setLoggedIn, isAdmin, setAdmin, isLoading, setLoading, error, setError}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;