import styles from './styles/super-homepage.module.css';  

export default function SuperUserHomepage() {
  return (
    <section className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>ServeWell</h1>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>SuperUser Homepage</h2>
          <a href="/" className={styles.button}>Go Back</a>
        </div>
      </div>
    </section>
  );
}