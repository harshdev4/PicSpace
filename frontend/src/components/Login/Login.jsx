import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { userContext } from "../../context/userContext";

const Login = () => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const passwordRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const context = useContext(userContext);
  const [isloaded, setIsLoaded] = useState(true);

  useEffect(() => {
    if (cookies.token) {
      navigate("/");
    }
  }, [navigate, cookies]);

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

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
      const response = await axios.post("/api/login", formData);
      if (response.status === 201) {
        context.setUser(response.data.user);
        navigate("/");
        setIsLoaded(true);
      }
    } catch (error) {
      if (error.response.status === 429) {
        setIsLoaded(true);
        setErrorMsg(error.response.data);
      } else {
        setIsLoaded(true);
        setErrorMsg(error.response.data.error);
        console.log(error);
      }
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
        <h4 id={styles.errorMsg}>{errorMsg}</h4>
        <form
          action=""
          method="post"
          className={styles.loginForm}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="username"
            value={formData.username.trim()}
            placeholder="Username"
            autoFocus
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
          <input type="submit" value="Log in" />
        </form>
      </div>
      <p id={styles.accountQuery}>
        Don't have an account?{" "}
        <Link to="/signup" id={styles.link}>
          {" "}
          Sign up{" "}
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

export default Login;
