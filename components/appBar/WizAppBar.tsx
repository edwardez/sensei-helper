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
import Link from 'next/link';
import SettingsDialog from 'components/settings/SettingsDialog';

export default function WizAppBar() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isSettingsOpened, setIsSettingsOpened] = React.useState<boolean>(false);

  const open = Boolean(anchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenSettingsDialog = () => {
    setIsSettingsOpened(true);
    handleCloseMenu();
  };
  const handleCloseSettingsDialog = () => {
    setIsSettingsOpened(false);
  };

  const navigateToThenCloseMenu = (url:string) => {
    router.push(url);
    handleCloseMenu();
  };
  const router = useRouter();
  const currentLang = router.locale;

  const handleChange = (event: SelectChangeEvent) => {
    const desiredLocale = event?.target?.value;
    if (!desiredLocale) return;

    router.push('/', '/', {locale: desiredLocale});
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
          <Link href="/">
            <a className={styles.title}>
              <Typography variant="h6" >
                Sensei Helper
              </Typography>
            </a>
          </Link>

          <Box sx={{flexGrow: 1}}>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
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
              aria-label="more options"
              onClick={handleOpenMenu}>
              <MoreVertIcon/>
            </IconButton>

            <Menu anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}>
              <MenuItem onClick={() => navigateToThenCloseMenu('privacy')}>Privacy</MenuItem>
              <MenuItem onClick={handleOpenSettingsDialog}>Settings</MenuItem>
              <MenuItem onClick={() => navigateToThenCloseMenu('about')}>About</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <SettingsDialog open={isSettingsOpened} onCloseDialog={handleCloseSettingsDialog}/>
    </React.Fragment>
  );
}
