import * as React from 'react';
import {styled} from '@mui/material/styles';
import {Card, CardProps} from '@mui/material';
import variables from 'scss/variables.module.scss';


export const baStyleTransformCss = {
  'transform': `skewX(${variables.baStandardSkewX})`,
  '> *:not(.exclude-revert-transform)': {
    'transform': `skewX(${variables.baStandardReverseSkewX})`,
  },
  '&.wiz-selected': {
    'outline': `3px solid ${variables.baHighlightCardBorderColor}`,
  },
  // '&::before': {
  //   content: `''`,
  //   position: 'absolute',
  //   background: '#58a',
  //   transform: 'skew(-45deg)',
  //   inset: 0,
  // },
  // '&': {
  //   position: 'relative',
  // },
};

const BuiCustomizedCard = styled(Card)<CardProps>(({theme}) => (baStyleTransformCss));

export default function BuiCard(props: CardProps) {
  return <BuiCustomizedCard {...props}/>;
}
