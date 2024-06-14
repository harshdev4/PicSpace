import { useContext, useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { userContext } from '../../context/userContext';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const context = useContext(userContext);
    const { pathname } = useLocation();
    const cookie = new Cookies();
    const token = cookie.get('token');
    const [decoded, setDecoded] = useState(null);
    const [activeLink, setActiveLink] = useState(pathname);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setDecoded(decodedToken);
        }
    }, [token]);

    useEffect(()=>{
        setActiveLink(pathname);
    }, [pathname]);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (decoded) {
                    const response = await axios.get(`/api/profile/${decoded.username}`);
                    if (response.status === 201) {
                        context.setUser(response.data);
                    }
                }
            } catch (error) {
                console.log(error.response.data.error);
            }
        }
        fetchUser();
    }, [decoded]);

    return (
        <>
            {context.user && pathname !== '/profile/edit' &&
                <div className={styles.Navbar}>
                    <nav>
                        <img src="/logo-title.png" alt="logo" className={styles.logo} />
                        <i className="fa-brands fa-instagram" id={styles.smallLogo}></i>
                        <Link to="/" className={`${activeLink==='/' && styles.active} ${styles.link}`} ><div className={styles.navGrid} ><i className="fa-solid fa-house" ></i><span className={styles.navTitle}>Home</span></div></Link>
                        <Link to="/search" className={`${activeLink==='/search' && styles.active} ${styles.link}`} ><div className={styles.navGrid} ><i className="fa-solid fa-magnifying-glass" ></i><span className={styles.navTitle}>Search</span></div></Link>
                        <Link to="/create-post" className={`${activeLink==='/create-post' && styles.active} ${styles.link}`} ><div className={styles.navGrid} ><i className="fa-solid fa-plus" id={styles.add} ></i><span className={styles.navTitle}>Create</span></div></Link>
                        <Link to={`/profile/${context.user.username}`} className={`${activeLink.includes('/profile/') && styles.active} ${styles.link}`} ><div className={styles.navGrid} ><img src={`https://eef9cb3e-552a-43d8-982f-5db59136ad2c-00-2dnj7xzof14lt.sisko.replit.dev/api/getImages/${context.user.profilePic}`} alt="" className={`${activeLink.includes('/profile/') && styles.activeProfileImage} ${styles.profile}`} onError={(e) => e.target.src = 'https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1'} /><span className={styles.navTitle}>Profile</span></div></Link>
                    </nav>
                </div>}
        </>
    )
}

export default Navbar;
