import axios from "axios";
import { useEffect, useState } from "react";
import styles from './SearchPage.module.css';
import {Cookies} from 'react-cookie';
import {Link, useNavigate} from 'react-router-dom';

const SearchPage=()=>{

    const [resultedUsers, setResultedUsers] = useState([]);

    const cookie = new Cookies();
    const navigate = useNavigate();

    async function handleChange(e){
        const value = e.target.value;
        try {
            const response = await axios.get(`/api/getUser/${value}`);
            setResultedUsers(response.data);
            
        } catch (error) {
            setResultedUsers([]);
        }
    } 

    useEffect(()=>{
        if (!(cookie.get("token"))) {
            navigate('/login');
        }
    },[]);

    return(
        <div className={` ${styles.searchPage} padding`}>
            <div className={styles.searchBarContainer}><i className="fa-solid fa-magnifying-glass" id={styles.searchIcon}></i><input type="text" name="text" className={styles.searchInput} placeholder="Search..." onChange={handleChange}/></div>
            {resultedUsers.length > 0 &&
            <div className={styles.seachUserContainer}>    {
                resultedUsers.map((user, index)=>(
                    <div key={index} className={styles.user}>
                        <Link to={`/profile/${user.username}`} className={styles.profileLink}>
                        <img src={`https://eef9cb3e-552a-43d8-982f-5db59136ad2c-00-2dnj7xzof14lt.sisko.replit.dev/api/getImages/${user.profilePic}`} alt="userPic" className={styles.userPic} onError={(e)=> e.target.src = 'https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1'}/>
                        <div className={styles.names}>
                            <h3 className={styles.username}>{user.username}</h3>
                            <h3 className={styles.fullname}>{user.fullname}</h3>
                        </div>
                        </Link>
                    </div>
                ))
            }</div>}

        </div>
    )
};

export default SearchPage;