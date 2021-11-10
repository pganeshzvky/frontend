import { useCallback, useEffect, useState } from 'react';
//import * as Api from 'api/casino-games';
import * as ApiUser from 'api/crash-game';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import PlaceBet from 'components/PlaceBet';
import PlaceBetRoulette from 'components/PlaceBetRoulette';
import BackLink from 'components/BackLink';
import Spins from 'components/Spins';
import GameAnimation from 'components/RouletteGameAnimation';
import GameBets from 'components/GameBets';
import Chat from 'components/Chat';
import { ROULETTE_GAME_EVENT_ID } from 'constants/RouletteGame';
import useRosiData from 'hooks/useRosiData';
import styles from './styles.module.scss';
import { AlertActions } from '../../store/actions/alert';
import { RosiGameActions } from '../../store/actions/rosi-game';
import ContentFooter from 'components/ContentFooter';
import ChatMessageType from 'components/ChatMessageWrapper/ChatMessageType';
import { ChatActions } from 'store/actions/chat';
import Share from '../../components/Share';
import PopupTheme from 'components/Popup/PopupTheme';
import Icon from 'components/Icon';
import IconType from 'components/Icon/IconType';
import IconTheme from 'components/Icon/IconTheme';
import { PopupActions } from 'store/actions/popup';
import EventActivitiesTracker from '../../components/EventActivitiesTracker';
import TabOptions from '../../components/TabOptions';
import ActivityTable from 'components/EventActivitiesTracker/ActivityTable';
import Routes from 'constants/Routes';
import { GameApi } from '../../api/casino-games';
import { GAMES } from '../../constants/Games';


const RouletteGame = ({
  showPopup,
  connected,
  userId,
  token,
  refreshHighData,
  refreshLuckyData,
}) => {
  const game = GAMES.alpacaWheel
  const ROSI_GAME_EVENT_ID = game.id;
  const Api = new GameApi(game.url, token);
  const dispatch = useDispatch();
  const {
    lastCrashes,
    inGameBets,
    cashedOut,
    hasStarted,
    isEndgame,
    highData,
    luckyData,
  } = useRosiData();
  const [audio, setAudio] = useState(null);
  const [spins, setSpins] = useState([]);
  const [risk, setRisk] = useState(1);
  const [bet, setBet] = useState(null);
  const [amount, setAmount] = useState(50);

  const isMiddleOrLargeDevice = useMediaQuery('(min-width:769px)');
  const [chatTabIndex, setChatTabIndex] = useState(0);
  const chatTabOptions = [{ name: 'CHAT', index: 0 }];
  const [activityTabIndex, setActivityTabIndex] = useState(0);
  const activityTabOptions = [
    { name: 'ACTIVITIES', index: 0 },
    { name: 'HIGH WINS', index: 1 },
    { name: 'LUCKY WINS', index: 2 },
  ];
  const handleHelpClick = useCallback(event => {
    showPopup(PopupTheme.explanation);
  }, []);

  useEffect(() => {
    ApiUser.getCurrentGameInfo()
      .then(response => {
        dispatch(
          RosiGameActions.initializeState({
            ...response.data,
            userId,
          })
        );
      })
      .catch(error => {
        dispatch(AlertActions.showError(error.message));
      });
    dispatch(ChatActions.fetchByRoom({ roomId: ROULETTE_GAME_EVENT_ID }));
    refreshHighData();
    refreshLuckyData();

  }, [dispatch, connected]);

  //Bets state update interval
  useEffect(() => {
    const interval = setInterval(() => dispatch(RosiGameActions.tick()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (hasAcceptedTerms() && !isPopupDisplayed()) {
        showPopup(PopupTheme.explanation);
        localStorage.setItem('gameHowDoesItWorkTip', true);
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, []);

  const hasAcceptedTerms = () => {
    return localStorage.getItem('acceptedTerms') || false;
  };

  const isPopupDisplayed = () => {
    return localStorage.getItem('gameHowDoesItWorkTip') || false;
  };

  const handleChatSwitchTab = option => {
    setChatTabIndex(option.index);
  };

  const handleActivitySwitchTab = ({ index }) => {
    switch (index) {
      case 1: // high wins
        refreshHighData();
        break;
      case 2: // lucky wins
        refreshLuckyData();
        break;
    }
    setActivityTabIndex(index);
  };

  async function handleBet(payload) {
    audio.playBetSound();
    console.log("handleBet", payload)
    if (!payload) return;
    try {
      const result = await Api.createTrade(payload);
      console.log(result)
      /*

      trackElonPlaceBet({ amount: payload.amount, multiplier: crashFactor });
      dispatch(RosiGameActions.setUserBet(payload));
      return result;
      */
    } catch (e) {
      dispatch(
        AlertActions.showError({
          message: 'Elon Game: Place Bet failed',
        })
      );
    }
  }

  const renderActivities = () => (
    <Grid item xs={12} md={6}>
      <div className={styles.activityWrapper}>
        <TabOptions options={activityTabOptions} className={styles.tabLayout}>
          {option => (
            <div
              className={
                option.index === activityTabIndex
                  ? styles.tabItemSelected
                  : styles.tabItem
              }
              onClick={() => handleActivitySwitchTab(option)}
            >
              {option.name}
            </div>
          )}
        </TabOptions>
        <div className={styles.activityContainer}>
          {activityTabIndex === 0 && (
            <EventActivitiesTracker
              activitiesLimit={50}
              className={styles.activitiesTrackerGamesBlock}
              preselectedCategory={'elongame'}
            />
          )}
          {activityTabIndex !== 0 && (
            <ActivityTable
              rowData={activityTabIndex === 1 ? highData : luckyData}
            />
          )}
        </div>
      </div>
    </Grid>
  );

  const renderChat = () => (
    <Grid item xs={12} md={6}>
      <div className={styles.chatWrapper}>
        <TabOptions options={chatTabOptions} className={styles.tabLayout}>
          {option => (
            <div
              className={
                option.index === chatTabIndex
                  ? styles.tabItemSelected
                  : styles.tabItem
              }
              onClick={() => handleChatSwitchTab(option)}
            >
              {option.name}
            </div>
          )}
        </TabOptions>
        <Chat
          roomId={ROULETTE_GAME_EVENT_ID}
          className={styles.chatContainer}
          chatMessageType={ChatMessageType.game}
        />
      </div>
    </Grid>
  );

  const renderBets = () => (
    <GameBets
      label="Cashed Out"
      bets={[
        ...inGameBets.map(b => ({
          ...b,
          cashedOut: false,
        })),
        ...cashedOut.map(b => ({
          ...b,
          cashedOut: true,
        })),
      ]}
      gameRunning={hasStarted}
      endGame={isEndgame}
    />
  );

  const renderWallpaperBanner = () => {
    return (
      <Link data-tracking-id="elon-wallpaper" to={Routes.elonWallpaper}>
        <div className={styles.banner}></div>
      </Link>
    );
  };
  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.headlineWrapper}>
            <BackLink to="/games" text="Roulette Game" />
            <Share popupPosition="right" className={styles.shareButton} />
            <Icon
              className={styles.questionIcon}
              iconType={IconType.question}
              iconTheme={IconTheme.white}
              height={25}
              width={25}
              onClick={handleHelpClick}
            />
            {/*}
            <span
              onClick={handleHelpClick}
              className={styles.howtoLink}
              data-tracking-id="elongame-how-does-it-work"
            >
              How does it work?
            </span>
            */}
          </div>

          <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
              <GameAnimation
                setSpins={newspin => setSpins([newspin, ...spins])}
                spins={spins}
                inGameBets={inGameBets}
                risk={risk}
                bet={bet}
                amount={amount}
                setBet={setBet}
                onInit={audio => setAudio(audio)}
              />
              <Spins text="My Spins" spins={spins} />
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.placeContainer}>
                <PlaceBetRoulette
                  connected={connected}
                  risk={risk}
                  setBet={setBet}
                  setAmount2={(amount)=>setAmount(amount)}
                  setRisk={setRisk}
                  onBet={handleBet}
                  onCashout={() => {
                    audio.playWinSound();
                  }}
                />
                {/*isMiddleOrLargeDevice ? renderBets() : null*/}
              </div>
            </div>
          </div>
          {/*isMiddleOrLargeDevice ? null : renderBets()*/}
          {isMiddleOrLargeDevice ? (
            <div className={styles.bottomWrapper}>
              {renderChat()}
              {renderActivities()}
            </div>
          ) : null}
          {/*isMiddleOrLargeDevice && renderWallpaperBanner()*/}
          <ContentFooter className={styles.betFooter} />
        </div>
      </div>
    </BaseContainerWithNavbar>
  );
};

const mapStateToProps = state => {
  return {
    connected: state.websockets.connected,
    userId: state.authentication.userId,
    token: state.authentication.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshHighData: () => dispatch(RosiGameActions.fetchHighData()),
    refreshLuckyData: () => dispatch(RosiGameActions.fetchLuckyData()),
    hidePopup: () => {
      dispatch(PopupActions.hide());
    },
    showPopup: (popupType, options) => {
      dispatch(
        PopupActions.show({
          popupType,
          options,
        })
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RouletteGame);