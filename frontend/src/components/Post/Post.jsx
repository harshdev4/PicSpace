import { useEffect, useRef, useState } from 'react';
import styles from './Post.module.css';
import axios from 'axios';
import PostSkeleton from '../PostSkeleton/PostSkeleton';
import { Link, useLocation } from 'react-router-dom';

const Post = ({user_name})=>{
    const imageUrl = "https://images.unsplash.com/photo-1712546852542-c853a88e1013?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const likeContainer = useRef();

    const postArray = [...Array(6).keys()];

    const [postArr, setPostArr] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);

    const username = user_name;

    const location = useLocation();

    const [whichPost, setWhichPost] = useState(" Posts");

    function showLike(e){
        const img = e.target;
        img.style.filter = "brightness(40%)";
        const anchorTag = img.parentNode;
        const likeTag = anchorTag.nextElementSibling;
        likeTag.style.display = "flex";
    }

    function hideLike(e){
        const img = e.target;
        img.style.filter = "brightness(100%)";
        const anchorTag = img.parentNode;
        const likeTag = anchorTag.nextElementSibling;
        likeTag.style.display = "none";
    }

    function moToRoute(e){
        if (e.target.textContent !== '') {
            setWhichPost(e.target.textContent);
            setPostArr([]);
        }
    }

    function iconMoveTo(e) {
        setWhichPost(e.target.parentNode.textContent);
        setPostArr([]);
    }

    useEffect(()=>{
        setIsLoaded(false);
        const fetchPost = async()=>{
            try {
                if (whichPost === ' Posts') {
                    const response = await axios.get(`/api/getPost/${username}`);
                    setPostArr(response.data);
                    setIsLoaded(true);
                }

                else{
                    const response = await axios.get(`/api/getPost/${username}/likedPost`);
                    setPostArr(response.data);
                    setIsLoaded(true);
                }
            } catch (error) {
                console.log(error.response.data.error);
            }
        };

        fetchPost();
    }, [whichPost, location.pathname]);

    return(
        <div className={`${styles.postPage} padding`}>
            <div className={styles.postHeading}>
                <h3 onClick={moToRoute} style={whichPost===' Posts' ? {borderTop: '2px solid'} : null}><i className="fa-solid fa-table-cells" onClick={iconMoveTo}></i> Posts</h3>
                <h3 onClick={moToRoute} style={whichPost===' Liked' ? {borderTop: '2px solid'} : null}><i className="fa-regular fa-heart" onClick={iconMoveTo}></i> Liked</h3>
                <h3><i className="fa-regular fa-bookmark"></i> Saved</h3>
            </div>

            <div className={styles.postSection}>
                {!isLoaded && <PostSkeleton/>}
                {
                    postArr.map((post, index)=>(
                        <div key={index} className={styles.post}>
                            <Link to={`/post/${post._id}`} className='imageLink'><img src={`https://eef9cb3e-552a-43d8-982f-5db59136ad2c-00-2dnj7xzof14lt.sisko.replit.dev/api/getImages/${post.image}`} alt="postImage" className={styles.postImage} onMouseOver={showLike} onMouseLeave={hideLike}/></Link>
                            <div className={styles.likeContainer} ref={likeContainer}><i className={`${styles.like} fa-solid fa-heart`}></i>  <span>{post.likes.length}</span> </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
};

export default Post;