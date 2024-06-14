import { useContext, useEffect, useState } from "react";
import { useCookies, Cookies } from "react-cookie";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.css";
import Post from "../Post/Post";
import { jwtDecode } from "jwt-decode";
import { userContext } from "../../context/userContext";

const Profile = () => {
  const [cookies, removeCookie] = useCookies([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerify] = useState(false);
  const [followStatus, setFollowStatus] = useState("Follow");
  const context = useContext(userContext);
  const { username } = useParams("username");
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [user, setUser] = useState();

  const [isloaded, setIsLoaded] = useState(false);

  const cookie = new Cookies();
  const token = cookie.get("token");
  let decoded;
  if (token) {
    decoded = jwtDecode(token);
  }

  const handleFollow = async () => {
    try {
      const response = await axios.get(`/api/follow/${username}`);
      if (response.status === 201) {
        console.log(response.data.message);
        setFollowStatus(response.data.status);
        setFollowerCount(response.data.followerCount);
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!cookies.token) {
        setIsVerify(false);
        navigate("/login");
      } else {
        try {
          setIsLoaded(false);
          setUser();
          const response = await axios.get(`/api/profile/${username}`);
          if (response.status === 201) {
            setUser(response.data);
            setFollowerCount(response.data.followers.length);
            setFollowingCount(response.data.following.length);
            if (response.data.followers.includes(decoded.userId)) {
              setFollowStatus("Following");
            }
            setIsLoaded(true);
          }
          setIsVerify(true);
        } catch (error) {
          console.log(error.response.data.error);
        }
      }
    };
    fetchUser();
  }, [navigate, cookies.token, removeCookie, location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/logout");
      if (response.status === 201) {
        setIsVerify(false);
        setUser(null);
        context.setUser(null);
        navigate("/login");
      }
    } catch (error) {
      setErrorLogout(error);
    }
  };

  return (
    <>
      {!isloaded && (
        <div className={styles.loading}>
          <div className={styles.loader}></div>
        </div>
      )}
      {isVerified && user && (
        <>
          <div className={`${styles.profile} padding`}>
            <div className={styles.profileInfo}>
              <div className={styles.pic}>
                <img
                  src={`http://localhost:3000/api/getImages/${user.profilePic}`}
                  alt="profilePic"
                  className={styles.profilePic}
                  onError={(event) => {
                    event.target.src =
                      "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1";
                  }}
                />
              </div>

              <div className={styles.infoSectionContainer}>
                <div className={styles.infoSection}>
                  <h2 className={styles.profileUsername}>{user.username}</h2>
                  {decoded.username === user.username ? (
                    <div className={styles.btnContainer}>
                      <Link
                        to="/profile/edit"
                        className={styles.profileSectionBtn}
                        id={styles.editBtn}
                      >
                        Edit Profile
                      </Link>
                      <button
                        className={styles.profileSectionBtn}
                        id={styles.logoutBtn}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.profileSectionBtn}
                      onClick={handleFollow}
                    >
                      {followStatus}
                    </button>
                  )}
                </div>

                <div className={`${styles.infoSection} ${styles.statsSection}`}>
                  <h2 className={styles.postCount}>
                    {user.post.length}
                    <span className={styles.followPostSpan}> post </span>
                  </h2>
                  <h2 className={styles.followerCount}>
                    {followerCount}{" "}
                    <span className={styles.followPostSpan}> followers </span>
                  </h2>
                  <h2 className={styles.followingCount}>
                    {followingCount}{" "}
                    <span className={styles.followPostSpan}> following </span>
                  </h2>
                </div>

                <div
                  className={`${styles.infoSection} ${styles.fullnameSection}`}
                >
                  <p className={styles.profileFullname}>{user.fullname}</p>
                </div>

                <div
                  className={`${styles.infoSection} ${styles.fullnameSection}`}
                >
                  <p className={styles.profileBio}>{user.profileBio}</p>
                </div>
              </div>
            </div>
            <h2
              className={`${styles.profileFullname} ${styles.underImageFullname}`}
            >
              {user.fullname}
            </h2>
            <p className={`${styles.profileBio} ${styles.underImageFullname}`}>
              {user.profileBio}
            </p>
          </div>

          <div className={`${styles.infoSection} ${styles.statsSectionSM} padding`} >
            <h2 className={styles.postCount}>
              {user.post.length}
              <span className={styles.followPostSpan}> post </span>
            </h2>
            <h2 className={styles.followerCount}>
              {followerCount}{" "}
              <span className={styles.followPostSpan}> followers </span>
            </h2>
            <h2 className={styles.followingCount}>
              {followingCount}{" "}
              <span className={styles.followPostSpan}> following </span>
            </h2>
          </div>

          <Post user_name={username} />
        </>
      )}
    </>
  );
};

export default Profile;
