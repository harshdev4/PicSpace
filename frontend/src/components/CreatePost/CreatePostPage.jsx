import { useContext, useEffect, useRef, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './CreatePostPage.module.css';
import axios from 'axios';
import {Cookies} from 'react-cookie';
import { feedContext } from '../../context/feedContext';

const CreatePost=()=>{
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInput = useRef();
    const navigate = useNavigate();
    const cookie = new Cookies();
    const [isPosted, setIsPosted] = useState(true);

    const {setNewPostId} = useContext(feedContext);

    const openfile = ()=>{
        fileInput.current.click();
    }

    const [file, setFile] = useState("/chooseImage.jpg");

    function handleFileChange(e) {
        setFormData({
            ...formData,
            ['postImage']: e.target.files[0]
        });
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function close(){
        navigate(-1);
    }

    const [formData, setFormData] = useState({
        postImage: null,
        postCaption: ''
    });

    const handleInput = (e)=>{
        setFormData({
            ...formData,
            ['postCaption']: e.target.value
        });
    }

    const handlePost = async(e)=>{ 
        e.preventDefault();
        const newFormData = new FormData();
        newFormData.append("postImage", formData.postImage);
        newFormData.append("postCaption", formData.postCaption);
        try {
            setIsPosted(false);
            const response = await axios.post('/api/create-post',newFormData, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        });
            if (response.status===201) {
                console.log(response.data.message);
                setNewPostId(response.data.newPostId);
                navigate('/');
                setIsPosted(true);
            }
        } catch (error) {
            setIsPosted(true);
            console.log(error.response.data.error);
        }
    }

    useEffect(()=>{
        if (!(cookie.get("token"))) {
            navigate('/login');
        }
    },[]);

    return(
        <div className={styles.createPostPage}>
            {!isPosted && 
            <div className={styles.loading}>
                <div className={styles.textArea}>
                <h3 className={styles.loadingText}>Please wait</h3>
                <h2 className={styles.loadingText}> {uploadProgress}% </h2>
                </div>
            </div>}
            <div className={styles.postArea}>
            <i className="fa-regular fa-circle-xmark" id={styles.close} onClick={close}></i>
                <img src={file} alt="" id={styles.selectedImage}/>
                <button onClick={openfile} id={styles.fileBtn}>Select from your device</button>
                <form action="" method="post" className={styles.postForm} encType='multipart/form-data' onSubmit={handlePost}>
                    <input type="file" name="postImage" id={styles.postImage} required ref={fileInput} accept="image/*" onChange={handleFileChange}/>
                    <input type="text" name="postCaption" id={styles.postCaption} placeholder="Caption..." value={formData.postCaption} onChange={handleInput} required/>
                    <input type="submit" value="Share" id={styles.shareBtn}/>
                </form>
            </div>
        </div>
    )
};

export default CreatePost;