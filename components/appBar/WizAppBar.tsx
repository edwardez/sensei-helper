import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import {FormControl, Menu, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import styles from './WizAppBar.module.scss';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function WizAppBar() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const currentLang = router.locale;

  const handleChange = (event: SelectChangeEvent) => {
    const desiredLocale = event?.target?.value;
    if (!desiredLocale) return;

    router.push('/', '', {locale: desiredLocale});
    Cookies.set('NEXT_LOCALE', desiredLocale);
  };

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
            <FormControl sx={{m: 1, minWidth: 120}} size="small">
              <Select variant={'outlined'}
                value={currentLang}
                onChange={handleChange}
                autoWidth>
                <MenuItem value={'en'}>English</MenuItem>
                <MenuItem value={'cn'}>中文</MenuItem>
                <MenuItem value={'jp'}>日本語</MenuItem>
              </Select>
            </FormControl>

            <IconButton size="large"
              aria-label="show 4 new mails"
              onClick={handleClick}>
              <MoreVertIcon/>
            </IconButton>

            <Menu anchorEl={anchorEl}
              open={open}
              onClose={handleClose}>
              <MenuItem onClick={handleClose}>Privacy</MenuItem>
              <MenuItem onClick={handleClose}>Terms of service</MenuItem>
              <MenuItem onClick={handleClose}>About</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
}
