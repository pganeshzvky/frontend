import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
import Search from '../../Search';
import Select from '../../Select';
import EventCard from '../../EventCard';
import CategoryList from '../../CategoryList';
import { useMappedActions } from './hooks/useMappedActions';
import { useSortFilter } from './hooks/useSortFilter';
import { useRouteHandling } from './hooks/useRouteHandling';
import ContentFooter from 'components/ContentFooter';
import AdminOnly from 'components/AdminOnly';
import { PopupActions } from 'store/actions/popup';
import PopupTheme from 'components/Popup/PopupTheme';
import EventJumbotron from 'components/EventJumbotron';
import { getCoverStream } from 'api';
import classNames from 'classnames';
import Icon from 'components/Icon';
import IconType from 'components/Icon/IconType';
import IconTheme from 'components/Icon/IconTheme';

function EventsContent({ eventType, categories, setCategories }) {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [coverStream, setCoverStream] = useState('');

  const { location, category } = useRouteHandling(eventType);

  const {
    fetchFilteredEvents,
    resetDefaultParamsValues,
    fetchFilteredBets,
    resetDefaultParamsBetValues,
  } = useMappedActions(eventType);

  const { handleSelectSortItem, selectedSortItem, sortOptions } =
    useSortFilter(eventType);

  const handleSearchSubmit = val => {
    if (eventType === 'non-streamed') {
      fetchFilteredBets({
        searchQuery: searchInput,
      });
    } else {
      fetchFilteredEvents({
        searchQuery: searchInput,
      });
    }
  };

  const handleSelectCategory = useCallback(
    value => {
      const updatedCats = categories.map(cat => {
        if (value !== cat.value)
          return {
            ...cat,
            isActive: false,
          };
        return {
          ...cat,
          isActive: true,
        };
      });

      setCategories(updatedCats);
    },
    [setCategories]
  );

  const events = _.orderBy(
    useSelector(state => state.event.filteredEvents)
    // ['date'],
    // ['desc']
  );

  const bets = _.orderBy(
    useSelector(state => state.bet.filteredBets)
    //   ['date'],
    //   ['desc']
  );

  const mappedTags = id =>
    events.find(event => event._id === id)?.tags.map(tag => tag.name) || [];

  useEffect(() => {
    handleSelectCategory(category);

    if (eventType === 'non-streamed') {
      fetchFilteredBets({
        category: category,
        sortBy: selectedSortItem,
      });
    } else {
      fetchFilteredEvents({
        category: category,
        sortBy: selectedSortItem,
      });
    }
  }, [
    category,
    selectedSortItem,
    fetchFilteredEvents,
    handleSelectCategory,
    eventType,
    fetchFilteredBets,
  ]);

  useEffect(() => {
    getCoverStream().then(({ response }) => {
      const responseCoverStream = _.chain(response).get('data').first().value();
      setCoverStream(responseCoverStream);
    });
    return () => {
      if (eventType === 'non-streamed') {
        resetDefaultParamsBetValues();
      } else {
        resetDefaultParamsValues();
      }
    };
  }, []);

  return (
    <>
      {eventType === 'streamed' && (
        <section className={classNames(styles.title, styles.hideMobile)}>
          <EventJumbotron event={coverStream} />
        </section>
      )}
      <section className={styles.title}>
        {eventType === 'streamed' ? 'Current Live Streams' : 'Events'}
      </section>
      <section className={styles.header}>
        <div className={styles.categories}>
          <CategoryList
            categories={categories}
            handleSelect={handleSelectCategory}
          />
        </div>
        <div className={styles.search}>
          <Search
            value={searchInput}
            handleChange={value => setSearchInput(value)}
            handleConfirm={handleSearchSubmit}
          />
        </div>
        <div className={styles.sort}>
          <Select
            value={selectedSortItem}
            placeholder="Sort by"
            options={sortOptions}
            handleSelect={handleSelectSortItem}
          />
        </div>
      </section>
      <section className={styles.main}>
        <AdminOnly>
          <div
            className={styles.newEventLink}
            onClick={() => {
              dispatch(
                PopupActions.show({
                  popupType: PopupTheme.newEvent,
                  options: {
                    eventType,
                  },
                })
              );
            }}
          >
            <Icon
              className={styles.newEventIcon}
              iconType={IconType.addYellow}
              iconTheme={IconTheme.white}
              height={25}
              width={25}
            />
            <span>New Event</span>
          </div>
        </AdminOnly>

        {eventType === 'streamed' &&
          events.map(item => (
            <Link
              to={{
                pathname: `/trade/${item.slug}`,
                state: { fromLocation: location },
              }}
              key={item._id}
            >
              <EventCard
                key={item._id}
                title={item.name}
                organizer={''}
                viewers={12345}
                state={item.state}
                tags={mappedTags(item._id)}
                image={item.previewImageUrl}
                eventEnd={item.date}
                streamUrl={item.streamUrl}
              />
            </Link>
          ))}

        {eventType === 'non-streamed' &&
          bets.map(item => (
            <Link
              to={{
                pathname: `/trade/${item.event.slug}/${item.slug}`,
                state: { fromLocation: location },
              }}
              key={item._id}
            >
              <EventCard
                key={item._id}
                title={item.marketQuestion}
                organizer={''}
                viewers={12345}
                state={item.status}
                tags={item.event.tags}
                image={item.event.previewImageUrl}
                eventEnd={item.endDate}
                // streamUrl={item.streamUrl}
              />
            </Link>
          ))}
      </section>
      <ContentFooter />
    </>
  );
}

export default EventsContent;
