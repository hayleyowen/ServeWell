import styles from './styles/member-tracking.module.css'; 

export default function MemberTracking() {
  return (
    <section className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>ServeWell</h1>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Member Tracking Page</h2>
          <a href="/" className={styles.button}>Go Back</a>
        </div>
      </div>
    </section>
  );
}
