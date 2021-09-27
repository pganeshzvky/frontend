import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { EventActions } from '../../../../store/actions/event';
import { BetActions } from '../../../../store/actions/bet';

export function useMappedActions(eventType) {
  const dispatch = useDispatch();

  const fetchFilteredEvents = useCallback(
    (params = {}) =>
      dispatch(
        EventActions.initiateFetchFilteredEvents({
          ...params,
          type: eventType,
        })
      ),
    [dispatch, eventType]
  );

  const resetDefaultParamsValues = () =>
    dispatch(EventActions.resetDefaultParamsValues());

  const fetchFilteredBets = useCallback(
    (params = {}) =>
      dispatch(
        BetActions.initiateFetchFilteredBets({
          ...params,
          type: eventType,
        })
      ),
    [dispatch, eventType]
  );

  const resetDefaultParamsBetValues = () =>
    dispatch(BetActions.resetDefaultParamsValues());

  return {
    fetchFilteredEvents,
    resetDefaultParamsValues,
    fetchFilteredBets,
    resetDefaultParamsBetValues,
  };
}
