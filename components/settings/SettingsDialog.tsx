import BuiDialog from 'components/bui/dialog/BuiDialog';
import {observer} from 'mobx-react-lite';
import {BuiDialogTitle} from 'components/bui/dialog/BuiDialogTitle';
import React, {ChangeEvent} from 'react';
import {Button, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {useStore} from 'stores/WizStore';
import {GameServer} from 'model/Equipment';

const SettingsDialog = ({open, onCloseDialog} : {open: boolean,
  onCloseDialog: () => void}) => {
  const store = useStore();
  const handleClose = () =>{
    onCloseDialog();
  };


  const handleGameServerChange = (event : ChangeEvent<HTMLElement>, value: string) => {
    store.changeGameServer(GameServer[value as keyof typeof GameServer]);
  };

  return <BuiDialog open={open}>
    <BuiDialogTitle onClose={handleClose}>
      <div>Settings</div>
    </BuiDialogTitle>
    <DialogContent>
      <BuiLinedText>Select your game server</BuiLinedText>
      <RadioGroup row value={`${store.gameInfoStore.gameServer}`} onChange={handleGameServerChange}>
        <FormControlLabel value={GameServer.Japan} control={<Radio />} label="Japan" />
        <FormControlLabel value={GameServer.Global} control={<Radio />} label="Global" />
      </RadioGroup>

    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Done</Button>
    </DialogActions>
  </BuiDialog>;
};

export default observer(SettingsDialog);
