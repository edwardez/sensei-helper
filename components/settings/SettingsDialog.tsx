import BuiDialog from 'components/bui/dialog/BuiDialog';
import {observer} from 'mobx-react-lite';
import {BuiDialogTitle} from 'components/bui/dialog/BuiDialogTitle';
import React, {ChangeEvent} from 'react';
import {DialogContent, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {useStore} from 'stores/WizStore';
import {GameServer} from 'model/Equipment';
import {useTranslation} from 'next-i18next';

const SettingsDialog = ({open, onCloseDialog} : {open: boolean,
  onCloseDialog: () => void}) => {
  const {t} = useTranslation('home');
  const store = useStore();
  const handleClose = () =>{
    onCloseDialog();
  };

  const handleGameServerChange = (event : ChangeEvent<HTMLElement>, value: string) => {
    store.changeGameServer(GameServer[value as keyof typeof GameServer]);
  };

  return <BuiDialog open={open} onClose={handleClose}>
    <BuiDialogTitle onClose={handleClose}>
      <div>{t('settingsDialogTitle')}</div>
    </BuiDialogTitle>
    <DialogContent>
      <BuiLinedText>{t('settingsDialogSelectGameServer')}</BuiLinedText>
      <RadioGroup row value={`${store.gameInfoStore.gameServer}`} onChange={handleGameServerChange}>
        <FormControlLabel value={GameServer.Japan} control={<Radio />} label={t('japanServer')} />
        <FormControlLabel value={GameServer.Global} control={<Radio />} label={t('globalServer')} />
        <FormControlLabel value={GameServer.China} control={<Radio />} label={t('chinaServer')} />
      </RadioGroup>

    </DialogContent>
  </BuiDialog>;
};

export default observer(SettingsDialog);
