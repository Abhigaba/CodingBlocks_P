"use client"

import { useContext, createContext, useState } from "react"

const AuthContext = createContext({
    info : {name : "", email: "", _id : "", isAdmin: "client"} ,
    setinfo : () => {},

})
export const AuthProvider = ({children}) => {
    const [info, setinfo] = useState({})
    const value = {
        info, 
        setinfo, 
    }
    return  (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}