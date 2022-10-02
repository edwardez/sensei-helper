type GTagEvent = {
  action: string;
  category: string;
  params: {[key:string] : any};
};

export const RESULT_BUTTON_CLICKED = 'result_button_clicked';
export const CATEGORY_PREFERENCE = 'preference';


export const INPUT_MODE = 'InputMode';

export const RESULT_MODE = 'ResultMode';

export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;

  window.gtag('config', 'GA_MEASUREMENT_ID', {
    'custom_map': {'dimension1': INPUT_MODE, 'dimension2': RESULT_MODE},
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const sendAnalytics = ({action, params}: GTagEvent) => {
  if (typeof window === 'undefined') return;

  window.gtag('event', action, params);
};
