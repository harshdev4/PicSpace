import { Link } from "react-router-dom";
import styles from "./SignUp.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

const SignUp = () => {
  const passwordRef = useRef(null);
  const [cookies, setCookie] = useCookies(["token"]);

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    username: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const [isloaded, setIsLoaded] = useState(true);

  useEffect(() => {
    if (cookies.token) {
      navigate("/");
    }
  }, [navigate, cookies]);

  const handleInput = (e) => {
    const regex = /^[a-zA-Z\s]*$/;
    if (e.target.name === "fullname" && regex.test(e.target.value)) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name !== "fullname") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
    setErrorMsg("");
  };

  function handlePassView(e) {
    e.target.classList.toggle("fa-eye");
    const password = document.getElementById("password");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoaded(false);
    try {
      const response = await axios.post("/api/register", formData);
      if (response.status === 201) {
        console.log(response.status);
        setCookie("token", response.data.token);
        setIsLoaded(true);
        navigate("/");
      }
    } catch (error) {
      setIsLoaded(true);
      setErrorMsg(error.response.data.error);
    }
  };

  return (
    <>
      {!isloaded && (
        <div className={styles.loading}>
          <div className={styles.loader}></div>
        </div>
      )}
      <div className={styles.content}>
        <img
          src="logo-title.png"
          alt="insta-logo"
          className={styles.logoTitle}
        />
        <p id={styles.signupMsg}>
          Sign up to see photos and videos from your friends.
        </p>
        <h4 id={styles.errorMsg}>{errorMsg}</h4>
        <form
          action=""
          method="post"
          className={styles.signupForm}
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleInput}
            autoFocus
            required
          />
          <input
            type="text"
            name="fullname"
            value={formData.fullname.trimStart()}
            placeholder="Full Name"
            onChange={handleInput}
            required
          />
          <input
            type="text"
            name="username"
            value={formData.username.trim()}
            placeholder="Username"
            onChange={handleInput}
            required
          />
          <div className={styles.passwordBlock}>
            <input
              type="password"
              ref={passwordRef}
              name="password"
              id="password"
              value={formData.password.trim()}
              placeholder="Password"
              onChange={handleInput}
              required
            />
            {passwordRef.current && passwordRef.current.value.length > 0 && (
              <i
                className={`fa-regular fa-eye fa-eye-slash ${styles.eye}`}
                onClick={handlePassView}
              ></i>
            )}
          </div>
          <input type="submit" value="Sign up" />
        </form>
      </div>
      <p id={styles.accountQuery}>
        Have an account?{" "}
        <Link to="/login" id={styles.link}>
          Log in
        </Link>
      </p>
      <h4 id={styles.getTheApp}>Get the app.</h4>
      <div className={styles.storeImageContainer}>
        <a
          href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3DFDADFAEC-A7C3-4CE7-A2DD-A5E03246D8D3%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge"
          target="_blank"
        >
          <img
            src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
            alt="playstore"
          />
        </a>
        <a
          href="https://apps.microsoft.com/detail/9nblggh5l9xt?hl=en-us&gl=US"
          target="_blank"
        >
          <img
            src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
            alt="microsoftstore"
          />
        </a>
      </div>
    </>
  );
};

export default SignUp;
