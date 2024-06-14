import { useContext, useEffect, useState } from "react";
import styles from "./Feed.module.css";
import ViewPost from "../ViewPost/ViewPost";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import { feedContext } from "../../context/feedContext";
import { Cookies } from "react-cookie";
import TopLogo from "../TopLogo/TopLogo";

const Feed = () => {

  const { user } = useContext(userContext);
  const { postArr, isLoading } = useContext(feedContext);
  const cookie = new Cookies();
  const navigate = useNavigate();

  useEffect(()=>{
    if (!cookie.get('token')) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.loader}></div>
        </div>
      )}
      {user && (
        <div className="padding">
          <div className={styles.storyContainer}>
          <Link to={`/profile/${user.username}`} className={styles.ProfileLink}>
            <div className={styles.story}>
              <div className={styles.storyImage}>
                <img
                  src={`http://localhost:3000/api/getImages/${user.profilePic}`}
                  alt=""
                  className={styles.storyPic}
                  onError={(e) =>
                    (e.target.src =
                      "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1")
                  }
                />{" "}
              </div>
              <h4 className={styles.storyTitle}>{user.fullname}</h4>
            </div>
          </Link>
          </div>
        </div>
      )}

      <div className={styles.postContainer}>
        {postArr.length > 0 &&
          postArr.map((post) => <ViewPost key={post._id} post_Id={post._id} />)
          }
      </div>
    </>
  );
};

export default Feed;
