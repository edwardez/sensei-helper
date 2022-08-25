import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/Settings';
import {Typography} from '@mui/material';
import styles from './WizAppBar.module.scss';

export default function WizAppBar() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar color={'transparent'} elevation={0}
        sx={{
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0)',
          border: '1px solid #E7EBF0',
          borderStyle: trigger ? `none none solid none` : 'none none none none'}}
        variant={'outlined'}>
        <Toolbar>
          <Typography variant="h6" className={styles.title}>
             Sensei Helper
          </Typography>

          <Box sx={{flexGrow: 1}}>
          </Box>
          <Box>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
}
