import styles from './styles/user-homepage.module.css';  

export default function UserHomepage() {
  return (
    <section className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>ServeWell</h1>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>User Homepage</h2>
          <a href="/" className={styles.button}>Go Back</a>
        </div>
      </div>
    </section>
  );
}