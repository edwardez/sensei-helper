import * as React from 'react';
import {styled} from '@mui/material/styles';
import {Paper, PaperProps} from '@mui/material';
import {baStyleTransformCss} from 'components/bui/BuiCard';


const WizCustomizedPaper = styled(Paper)<PaperProps>(({theme}) => (baStyleTransformCss));

export default function BuiPaper(props: PaperProps) {
  return <WizCustomizedPaper {...props}/>;
}
