import TagManager from 'react-gtm-module';

export const initTagManager = () => {
  if (!process.env.REACT_APP_GTM_ID) {
    console.log('Google Tag Manager ID not configured!');
    return;
  }

  const tagManagerArgs = {
    gtmId: process.env.REACT_APP_GTM_ID,
  };

  TagManager.initialize(tagManagerArgs);
};

export const dataLayerPush = dataLayerProps => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackPageView = dataLayerProps => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      pageUrl: window.location.href,
      event: 'virtualPageview',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackNonstreamedEventPlaceTrade = dataLayerProps => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      pageUrl: window.location.href,
      event: 'nonstreamedEventPlaceTrade',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackApproveCashout = dataLayerProps => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      event: 'approveCashout',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackSignup = ({ method, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      method,
      event: 'signUp',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

/* ELON GAME CUSTOM EVENTS TRACKING */

export const trackElonChangeAutoCashout = ({
  multiplier,
  ...dataLayerProps
}) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      multiplier,
      event: 'elongameChangeAutoCashout',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackElonPlaceBet = ({
  amount,
  multiplier,
  autobet,
  ...dataLayerProps
}) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      autobet,
      event: 'elongamePlaceBet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackElonPlaceBetGuest = ({
  amount,
  multiplier,
  ...dataLayerProps
}) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      event: 'elongamePlaceBetGuest',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackElonCashout = ({ amount, multiplier, autobet, accumulated, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      autobet,
      accumulated,
      event: 'elongameCashout',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackElonCancelBet = ({ amount, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      event: 'elongameCancelBet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackElonStartAutobet = ({ amount, multiplier, autobet, profit, loss, wincrease, lincrease, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount, //bet amount
      multiplier, //attemp auto cashout at
      autobet, //autobet true/false
      profit, //stop on profit
      loss, //stop on loss
      wincrease, //on win inscrease
      lincrease, //on loss increase
      event: 'elongameStartAutobet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackElonStopAutobet = ({ amount, multiplier, autobet, profit, loss, wincrease, lincrease, accumulated, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount, //bet amount
      multiplier, //attemp auto cashout at
      autobet, //autobet true/false
      profit, //stop on profit
      loss, //stop on loss
      wincrease, //on win inscrease
      lincrease, //on loss increase
      accumulated,
      event: 'elongameStopAutobet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};


/* ALPACAWHEEL GAME CUSTOM EVENTS TRACKING */

export const trackAlpacaWheelPlaceBet = ({
  amount,
  multiplier,
  autobet,
  ...dataLayerProps
}) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      autobet,
      event: 'alpacawheelPlaceBet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackAlpacaWheelPlaceBetGuest = ({
  amount,
  multiplier,
  ...dataLayerProps
}) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      event: 'alpacawheelPlaceBetGuest',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackAlpacaWheelCashout = ({ amount, multiplier, accumulated, autobet, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      autobet,
      accumulated,
      event: 'alpacawheelCashout',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackAlpacaWheelStartAutobet = ({ amount, multiplier, autobet, profit, loss, wincrease, lincrease, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount, //bet amount
      multiplier, //attemp auto cashout at
      autobet, //autobet true/false
      profit, //stop on profit
      loss, //stop on loss
      wincrease, //on win inscrease
      lincrease, //on loss increase
      event: 'alpacawheelStartAutobet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackAlpacaWheelStopAutobet = ({ amount, multiplier, autobet, profit, loss, wincrease, lincrease, accumulated, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount, //bet amount
      multiplier, //attemp auto cashout at
      autobet, //autobet true/false
      profit, //stop on profit
      loss, //stop on loss
      wincrease, //on win inscrease
      lincrease, //on loss increase
      accumulated,
      event: 'alpacawheelStopAutobet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};


// PLINKO

export const trackPlinkoPlaceBet = ({
  amount,
  multiplier,
  autobet,
  ...dataLayerProps
}) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      autobet,
      event: 'plinkoPlaceBet',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export const trackPlinkoCashout = ({ amount, multiplier, accumulated, autobet, ...dataLayerProps }) => {
  const tagManagerArgs = {
    dataLayer: {
      ...dataLayerProps,
      amount,
      multiplier,
      autobet,
      accumulated,
      event: 'plinkoCashout',
    },
  };

  TagManager.dataLayer(tagManagerArgs);
};

export default TagManager;
