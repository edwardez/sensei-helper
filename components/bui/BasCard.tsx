import * as React from 'react';
import {styled} from '@mui/material/styles';
import {Card, CardProps} from '@mui/material';
import variables from 'scss/variables.module.scss';


export const baStyleTransformCss = {
  'transform': `skewX(${variables.baStandardSkewX})`,
  '> *:not(.exclude-revert-transform)': {
    'transform': `skewX(${variables.baStandardReverseSkewX})`,
  },
  '&.bas-selected': {
    'outline': `3px solid ${variables.baHighlightCardBorderColor}`,
  },
};

const BasCustomizedCard = styled(Card)<CardProps>(({theme}) => (baStyleTransformCss));

export default function BasCard(props: CardProps) {
  return <BasCustomizedCard {...props}/>;
}
