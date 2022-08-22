import * as React from 'react';
import {styled} from '@mui/material/styles';
import {Paper, PaperProps} from '@mui/material';
import {baStyleTransformCss} from 'components/bui/BasCard';

const BasCustomizedPaper = styled(Paper)<PaperProps>(({theme}) => (baStyleTransformCss));

export default function BasPaper(props: PaperProps) {
  return <BasCustomizedPaper {...props}/>;
}
