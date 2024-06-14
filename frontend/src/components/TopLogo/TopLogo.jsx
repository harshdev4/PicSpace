import styles from './TopLogo.module.css';

const TopLogo = ()=>{
    return (
        <>
         <div className={styles.logoContainer}>
            <img className={styles.logoImage} src="/logo-title.png" alt="logo" />
          </div>
          <div className={styles.dummyDiv}></div>
        </>
    )
}

export default TopLogo;