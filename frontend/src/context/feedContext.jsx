import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { Cookies } from "react-cookie";
import { userContext } from "./userContext";
import { useNavigate } from "react-router-dom";
export const feedContext = createContext({
    postArr: [],
    isLoading: true,
    setNewPostId: ()=>{}
});

const FeedContextProvider = ({children})=>{
    const { deleted } = useContext(userContext);

    const [postArr, setPostArr] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newPostId, setNewPostId] = useState(null);
    const cookie = new Cookies();
    const navigate = useNavigate();

    const fetchPost = async ()=>{
        setIsLoading(true);
        try {
            const response = await axios.get("/api/feed");
            if (response.status === 201) {
              setPostArr(response.data.posts);
            }
        } catch (error) {
            console.log("Server timed out");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        fetchPost();
    }, [newPostId, deleted]);

    return(
        <feedContext.Provider value={{postArr, isLoading, setNewPostId}}>
            {children}
        </feedContext.Provider>
    )

}

export default FeedContextProvider;