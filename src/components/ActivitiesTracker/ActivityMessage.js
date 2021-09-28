import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import DateText from '../../helper/DateText';
import ChatMessage from '../ChatMessage';
import BetActionChatMessage from '../BetActionChatMessage';
import ChatMessageType from '../ChatMessageWrapper/ChatMessageType';
import styles from './styles.module.scss';
import State from '../../helper/State';
import { WebsocketsActions } from '../../store/actions/websockets';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getProfilePictureUrl } from '../../helper/ProfilePicture';

const ActivityMessage = ({ activity, date, users, events }) => {
  const [dateString, setDateString] = useState('');

  const updateDateText = useCallback(() => {
    const dateText = DateText.getChatTimeText(date);

    setDateString(dateText);
  }, [date]);

  useEffect(() => {
    updateDateText();
    const timerId = window.setInterval(updateDateText, 5 * 1000);

    return () => clearInterval(timerId);
  }, [date, updateDateText]);

  const getEventUrl = data => {
    const event = _.get(data, 'event');

    if (event.type === 'streamed') {
      return (
        <a
          target={'_blank'}
          href={`${window.location.origin}/trade/${event.slug}`}
        >
          {event.name}
        </a>
      );
    } else if (event.type === 'non-streamed' && event.bets.length === 1) {
      return (
        <a
          target={'_blank'}
          href={`${window.location.origin}/trade/${event.slug}/${event.bets[0].slug}`}
        >
          {event.bets[0].marketQuestion}
        </a>
      );
    }
  };

  const prepareMessageByType = (activity, user) => {
    const data = activity.data;
    let event = _.get(data, 'event');

    if (!event) {
      event = State.getEvent(_.get(data, 'bet.event'), events);
    }

    switch (activity.type) {
      case 'Notification/EVENT_START':
        return `Event [NAME] `;
      case 'Notification/EVENT_RESOLVE':
        return `Event resolved [EVENT DATA] `;
      case 'Notification/EVENT_CANCEL':
        return `Event cancelled [EVENT DATA] `;
      case 'Notification/EVENT_NEW_REWARD':
        return `New reward [EVENT DATA] `;
      case 'Notification/EVENT_ONLINE':
        return `Stream ${data.event.name} has become online.`; //EDITED
      case 'Notification/EVENT_OFFLINE':
        return `Stream ${data.event.name} has become offline.`; //EDITED
      case 'Notification/EVENT_NEW':
        return (
          <div>
            New event has been created <b>{getEventUrl(data)}</b>.
          </div>
        ); //EDITED
      case 'Notification/EVENT_NEW_BET':
        return (
          <div>
            New bet has created $
            {
              <a
                target={'_blank'}
                href={`${window.location.origin}/trade/${_.get(
                  event,
                  'slug'
                )}/${_.get(event, 'bets[0].slug')}`}
              >
                {_.get(event, 'bets[0].marketQuestion')}
              </a>
            }
            .
          </div>
        ); //EDITED
      case 'Notification/EVENT_BET_PLACED':
        return (
          <div>
            <b>{_.get(user, 'username', 'Unknown user')}</b> has bet{' '}
            {data.trade.investmentAmount} WFAIR on{' '}
            {
              <a
                target={'_blank'}
                href={`${window.location.origin}/trade/${_.get(
                  event,
                  'slug'
                )}/${_.get(data, 'bet.slug')}`}
              >
                <b>{data.bet.marketQuestion}</b>
              </a>
            }{' '}
            with {data.bet.outcomes[data.trade.outcomeIndex].name}.
          </div>
        );
      case 'Notification/EVENT_BET_CASHED_OUT':
        return `${user.username} has cashed out from ${data}.`;
      case 'Notification/EVENT_BET_RESOLVED':
        return `Event has been resolved [EVENT DATA] `;
      default:
        return '';
    }
  };

  const renderMessageContent = () => {
    const type = _.get(activity, 'type');
    const userId = _.get(activity, 'userId');
    const user = State.getUser(userId, users);
    const profilePicture = getProfilePictureUrl(_.get(user, 'profilePicture'));
    const userName = _.get(user, 'username', 'Unknown');

    return (
      <div className={classNames(styles.chatMessage, styles.messageItem)}>
        {/*<img src={profilePicture} alt={userName} />*/}
        <div>
          <small className={styles.dateString}>{dateString}</small>
          {prepareMessageByType(activity, user)}
        </div>
      </div>
      // <ChatMessage
      //   className={styles.messageItem}
      //   // user={user}
      //   message={prepareMessageByType(activity, user)}
      //   dateString={dateString}
      // />
    );

    return null;
  };

  return renderMessageContent();
};

const mapStateToProps = (state, ownProps) => {
  return {
    users: _.get(state, 'user.users', []),
    events: _.get(state, 'event.events', []),
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMessage);