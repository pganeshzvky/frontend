import VideoPlayer from 'components/EmbedVideo/VideoPlayer';
import styles from './styles.module.scss';

const LandingPage = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.mainHeading}>Betting Reimagined</h1>
      <div className={styles.slogan}>
        <span>Clear, Social & Fair</span>
      </div>
      <div className={styles.video}>
        <VideoPlayer
          video="https://files.wallfair.io/wallfair.mp4"
          controls={true}
          loop={true}
        />
      </div>
    </div>
  );
};

export default LandingPage;
