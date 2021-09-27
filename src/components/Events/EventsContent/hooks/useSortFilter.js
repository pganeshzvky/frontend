import { useState } from 'react';
import { useSelector } from 'react-redux';

const defaultSort = {
  'non-streamed': 'marketQuestion',
  streamed: 'name',
};

export function useSortFilter(eventType) {
  const [selectedSortItem, setSelectedSortItem] = useState(
    defaultSort[eventType]
  );

  const sortOptions = useSelector(state =>
    eventType === 'non-streamed'
      ? state.bet.betSortOptions
      : state.event.eventSortOptions
  );

  const handleSelectSortItem = item => {
    console.log('item :>> ', item);
    setSelectedSortItem(item);
  };

  return {
    handleSelectSortItem,
    selectedSortItem,
    sortOptions,
  };
}
