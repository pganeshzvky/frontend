import _ from 'lodash';
import update from 'immutability-helper';
import { BetTypes } from '../actions/bet';

const initialState = {
  bets: [],
  filteredBets: [],
  actionIsInProgress: false,
  outcomes: {},
  sellOutcomes: {},
  openBets: [],
  wfairValue: 0.2,
  tradeHistory: {
    trades: [],
  },
  defaultParams: {
    type: 'all',
    category: 'all',
    count: '30',
    page: '1',
    sortBy: 'marketQuestion',
    searchQuery: '',
  },
  betSortOptions: [
    {
      label: 'Alphabetically (A-Z)',
      value: 'marketQuestion',
    },
    {
      label: 'Alphabetically (Z-A)',
      value: '-marketQuestion',
    },
    {
      label: 'End date (newest first)',
      value: 'date',
    },
    {
      label: 'End date (oldest first)',
      value: '-date',
    },
  ],
};

const fetchAllSucceeded = (action, state) => {
  return update(state, {
    bets: {
      $set: action.bets,
    },
  });
};

const setFilteredEvents = (state, { payload }) => {
  return {
    ...state,
    filteredBets: payload,
  };
};

const setDefaultParamsValues = (state, { payload }) => {
  return {
    ...state,
    defaultParams: {
      ...state.defaultParams,
      ...payload,
    },
  };
};

const resetDefaultParamsValues = (state, { payload }) => {
  return {
    ...state,
    defaultParams: {
      type: 'all',
      category: 'all',
      count: '30',
      page: '1',
      sortBy: 'marketQuestion',
      searchQuery: '',
    },
  };
};

const setActionIsInProgress = (action, state) => {
  let isInProgress = false;

  switch (action.type) {
    case BetTypes.PLACE:
    case BetTypes.PULL_OUT_BET:
      isInProgress = true;

      break;
  }

  return update(state, {
    actionIsInProgress: {
      $set: isInProgress,
    },
  });
};

const setOutcomes = (action, state) => {
  return updateOutcomes('outcomes', action, state);
};

const setSellOutcomes = (action, state) => {
  return updateOutcomes('sellOutcomes', action, state);
};

const updateOutcomes = (outcomeType, action, state) => {
  return {
    ...state,
    [outcomeType]: {
      ...action.outcomes,
    },
  };
};

const fetchOpenBetsSucceeded = (action, state) => {
  const openBets = _.get(action, 'openBets', []);

  return update(state, {
    openBets: {
      $set: openBets,
    },
  });
};

const fetchTradeHistorySuccess = (action, state) => {
  return update(state, {
    tradeHistory: {
      trades: {
        $set: action.trades,
      },
    },
  });
};

export default function (state = initialState, action) {
  switch (action.type) {
    // @formatter:off
    case BetTypes.FETCH_ALL_SUCCEEDED:
      return fetchAllSucceeded(action, state);
    case BetTypes.FETCH_FILTERED_SUCCESS:
      return setFilteredEvents(state, action);
    case BetTypes.SET_DEFAULT_PARAMS_VALUES:
      return setDefaultParamsValues(state, action);
    case BetTypes.RESET_DEFAULT_PARAMS_VALUES:
      return resetDefaultParamsValues(state, action);
    case BetTypes.SET_OUTCOMES:
      return setOutcomes(action, state);
    case BetTypes.SET_SELL_OUTCOMES:
      return setSellOutcomes(action, state);
    case BetTypes.FETCH_OPEN_BETS_SUCCEEDED:
      return fetchOpenBetsSucceeded(action, state);
    case BetTypes.FETCH_TRADE_HISTORY_SUCCESS:
      return fetchTradeHistorySuccess(action, state);
    case BetTypes.PLACE:
    case BetTypes.PULL_OUT_BET:
    case BetTypes.PLACE_SUCCEEDED:
    case BetTypes.PLACE_FAILED:
    case BetTypes.PULL_OUT_BET_SUCCEEDED:
    case BetTypes.PULL_OUT_BET_FAILED:
      return setActionIsInProgress(action, state);
    default:
      return state;
    // @formatter:on
  }
}
