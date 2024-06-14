import { createContext, useState } from "react";

export const userContext = createContext({
    user: null,
    setUser: ()=>{},
    deleted: null,
    setDeleted: ()=>{}
});

const UserContextProvider = ({children})=>{
    
    const [user, setUser] = useState();
    const [deleted, setDeleted] = useState(null);

    return(
        <userContext.Provider value={{user, setUser, deleted, setDeleted}}>
            {children}
        </userContext.Provider>
    )
};

export default UserContextProvider;
