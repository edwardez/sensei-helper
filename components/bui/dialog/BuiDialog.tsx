import {Dialog, DialogProps, useMediaQuery, useTheme} from '@mui/material';
import * as React from 'react';


export default function BuiDialog(props: DialogProps) {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return <Dialog fullScreen={isFullScreen} {...props}/>;
}
