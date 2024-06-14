import { useContext, useEffect, useRef, useState } from "react";
import styles from "./ViewPost.module.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { userContext } from "../../context/userContext";

const ViewPost = ({ post_Id: postIdProp }) => {
  const { post_Id } = useParams();
  const postId = postIdProp || post_Id;
  const menu = useRef();
  const menuList = useRef();
  const alertBox = useRef();
  const postCaption = useRef();
  const editSectionBtn = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const { setDeleted } = useContext(userContext);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const decodedToken = jwtDecode(token);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState();

  async function handleLike(e) {
    try {
      const response = await axios.get(`/api/like/${post._id}`);
      e.target.classList.toggle("fa-regular");
      e.target.classList.toggle("fa-solid");
      e.target.classList.toggle("likeColor");
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  const toggleMenu = () => {
    document.body.style.overflow = "hidden";
    menu.current.style.display = "block";
    menuList.current.style.display = "flex";
  };

  const closeMenu = (event) => {
    if (!menuList.current.contains(event.target) && !isAlertOpen) {
      document.body.style.overflow = "unset";
      menu.current.style.display = "none";
    }
  };

  const deletePost = async () => {
    try {
      const response = await axios.get(`/api/post/delete/${postId}`);
      if (response.status === 201) {
        if (location.pathname === "/") {
          console.log("deleted");
          setDeleted(response.data.postId);
          document.body.style.overflow = "unset";
          menu.current.style.display = "none";
        } else navigate(-1);
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  function closeDeleteAlert() {
    setIsAlertOpen(false);
    alertBox.current.style.display = "none";
    menu.current.style.display = "none";
    document.body.style.overflow = "unset";
  }

  const openDeleteAlert = () => {
    setIsAlertOpen(true);
    menuList.current.style.display = "none";
    alertBox.current.style.display = "grid";
  };

  const openEditBox = () => {
    setIsEditing(true);
    menu.current.style.display = "none";
    document.body.style.overflow = "unset";
    editSectionBtn.current.style.display = "block";
    postCaption.current.readOnly = false;
    postCaption.current.focus();
    postCaption.current.classList.add("editMode");
  };

  const handleEditedCaption = (e) => {
    setEditedCaption(e.target.value);
  };

  const saveEditCaption = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/post/${postId}/edit`, {
        editedCaption: editedCaption,
      });
      if (response.status === 201) {
        setIsEditing(false);
        setEditedCaption();
        editSectionBtn.current.style.display = "none";
        postCaption.current.classList.remove("editMode");
        postCaption.current.readOnly = true;
        postCaption.current.blur();
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const closeEditBox = (event) => {
    setIsEditing(false);
    event.preventDefault();
    setEditedCaption();
    editSectionBtn.current.style.display = "none";
    postCaption.current.classList.remove("editMode");
    postCaption.current.readOnly = true;
    postCaption.current.blur();
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/viewPost/${postId}`);
        if (response.status === 201) {
          setPost(response.data);
          setLikeCount(response.data.likes.length);
        }
      } catch (error) {
        console.log(error.response.data.error);
      }
    };
    fetchPost();
  }, [isEditing]);

  return (
    <div className={`${styles.viewPostPage} padding`}>
      {post && post.userId && (
        <div className={`${styles.postContainer} padding`}>
          <div className={styles.menu} ref={menu} onClick={closeMenu}>
            <ul ref={menuList} id="menuList">
              <li onClick={openEditBox}>Edit caption</li>
              <li onClick={openDeleteAlert}>Delete post</li>
            </ul>
            <div className={styles.alertForDelete} ref={alertBox} id="alertBox">
              <div className={styles.alertContext}>
                <h3>Delete post?</h3>
                <p>Are you sure you want to delete this post?</p>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td onClick={deletePost}>Delete</td>
                  </tr>
                  <tr>
                    <td onClick={closeDeleteAlert}>Cancel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={`${styles.post}`}>
            {decodedToken.username === post.userId.username && (
              <i
                className={`fa-solid fa-ellipsis dots ${styles.dots}`}
                onClick={toggleMenu}
              ></i>
            )}
            <Link
              to={`/profile/${post.userId.username}`}
              className={styles.link}
            >
              <div className={styles.header}>
                <img
                  src={`https://eef9cb3e-552a-43d8-982f-5db59136ad2c-00-2dnj7xzof14lt.sisko.replit.dev/api/getImages/${post.userId.profilePic}`}
                  alt=""
                  className={styles.profileImage}
                  onError={(event) => {
                    event.target.src =
                      "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1";
                  }}
                />
                <div className={styles.names}>
                  <h3 className={styles.username}>{post.userId.username}</h3>
                  <h3 className={styles.fullname}>{post.userId.fullname}</h3>
                </div>
              </div>
            </Link>
            <div className={styles.postImage}>
              <img
                src={`https://eef9cb3e-552a-43d8-982f-5db59136ad2c-00-2dnj7xzof14lt.sisko.replit.dev/api/getImages/${post.image}`}
                alt=""
                className={styles.postImage}
              />
            </div>
            <div className={styles.likeSection}>
              <i
                className={`fa-heart ${
                  post.likes.includes(decodedToken.userId)
                    ? "fa-solid likeColor"
                    : "fa-regular"
                } ${styles.likeBtn}`}
                onClick={handleLike}
              ></i>{" "}
              {likeCount} likes
            </div>

            <form method="post" onSubmit={saveEditCaption}>
              <textarea
                name="postCaption"
                ref={postCaption}
                className={styles.caption}
                readOnly
                value={!isEditing ? post.caption : editedCaption}
                onChange={handleEditedCaption}
              ></textarea>

              <div className={styles.editSectionBtn} ref={editSectionBtn}>
                <input type="submit" value="Save" />
                <button onClick={closeEditBox}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPost;
