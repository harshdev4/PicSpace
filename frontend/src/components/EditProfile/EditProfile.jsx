import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditProfile.module.css";
import { userContext } from "../../context/userContext";
import { jwtDecode } from "jwt-decode";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    profilePic: null, // Initialize profilePic as null
  });

  const [textData, setTextData] = useState({
    profileBio: "",
    fullname: "",
  });

  const context = useContext(userContext);

  const [profileUpdated, setProfileUpdate] = useState(false);
  const [isPosted, setIsPosted] = useState(true);

  const [cookies] = useCookies([]); // Removed removeCookie since it's not used
  const token = cookies.token;
  const decodedToken = jwtDecode(token);
  const navigate = useNavigate();
  const [isVerified, setIsVerify] = useState(false);
  const [user, setUser] = useState(null); // Initialize user as null

  const [updatedMsg, setUpdatedMsg] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handleImageInput = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setFormData({
      ...formData,
      profilePic: e.target.files[0], // Assuming you only allow single file uploads
    });
  };

  const handleEditProfilePhoto = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("profilePic", formData.profilePic); // Append the file

    try {
        setIsPosted(false);
      const response = await axios.post("/api/profile/editpic", formDataToSend);
      if (response.status === 201) {
        context.setUser(response.data.user);
        setUpdatedMsg("Profile Pic Updated Successfully");
        setProfileUpdate(true);
        setIsPosted(true);
        setTimeout(() => {
          setUpdatedMsg("");
          setProfileUpdate(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error.response.data.decoded);
      setUpdatedMsg("Some Error Occurred, try again");
    }
  };

  const handleInput = (e) => {
    const regex = /^[a-zA-Z\s]*$/;
    if(e.target.name === "fullname" && regex.test(e.target.value)){
      setTextData({
        ...textData,
        [e.target.name]: e.target.value,
      });
    }
    else if(e.target.name !== "fullname"){
    setTextData({
      ...textData,
      [e.target.name]: e.target.value,
    });
  }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
        setIsPosted(false);
      const response = await axios.post("/api/profile/edit", textData);
      if (response.status === 201) {
        context.setUser(response.data.user);
        setUpdatedMsg("Profile Updated Successfully");
        setIsPosted(true);
        setTimeout(() => {
          setUpdatedMsg("");
        }, 2000);
      }
    } catch (error) {
      console.log(error.response.data.filepath);
      setIsPosted(true);
      setUpdatedMsg("Some Error Occurred, try again");
    }
  };

  const back = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!cookies.token) {
        setIsVerify(false);
        navigate("/login");
      } else {
        try {
          const response = await axios.get(
            `/api/profile/${decodedToken.username}`
          );
          if (response.status === 201) {
            setUser(response.data);
          }
          setIsVerify(true);
        } catch (error) {
          console.log(error.response.data.error);
        }
      }
    };
    fetchUser();
  }, [navigate, cookies.token, profileUpdated]);

  useEffect(() => {
    if (user) {
      setTextData({
        profileBio: user.profileBio,
        fullname: user.fullname,
      });
    }
  }, [user]);

  return (
    <>
      {isVerified && user && (
        <>
          <div className={styles.logo}>
            <img src="/logo-title.png" alt="logo" id={styles.logo} />
          </div>
          {!isPosted && (
            <div className={styles.loading}>
              <h3 className={styles.loadingText}>Updating..., please wait</h3>
            </div>
          )}
          <button onClick={back} id={styles.backBtn}>
          <i class="fa-solid fa-arrow-left" style={{fontSize: '18px'}}></i>
          </button>
          <h1 id={styles.updatedMsg}>{updatedMsg}</h1>
          <h3 id={styles.heading}>Edit Profile</h3>
          <div className={styles.imageUpdateSection}>
            <img
              src={ selectedImage || `http://localhost:3000/api/getImages/${user.profilePic}`}
              alt="profile-pic"
              className={styles.profileImage}
              onError={(e) => {
                e.target.src =
                  "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1";
              }}
            />
            <form
              method="post"
              encType="multipart/form-data"
              onSubmit={handleEditProfilePhoto}
            >
              <input
                type="file"
                name="profilePic"
                id={styles.profilePic}
                onChange={handleImageInput}
                accept="image/*"
                required
              />
              <input
                type="submit"
                value="Change photo"
                className={styles.submitBtn}
              />
            </form>
          </div>

          <div className={styles.textUpdateSection}>
            <form method="post" onSubmit={handleEditProfile}>
              <input
                type="text"
                name="fullname"
                value={textData.fullname}
                placeholder="Full Name"
                onChange={handleInput}
                className={styles.input}
              />
              <input
                type="text"
                name="profileBio"
                value={textData.profileBio || ""}
                placeholder="Bio..."
                onChange={handleInput}
                className={styles.input}
              />
              <input
                type="submit"
                value="Submit"
                className={styles.submitBtn}
              />
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default EditProfile;
