import {BuiDialogTitle} from 'components/bui/dialog/BuiDialogTitle';
import BuiDialog from 'components/bui/dialog/BuiDialog';
import React from 'react';
import {Button, DialogActions, DialogContent, TextField} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import Box from '@mui/material/Box';
import {useTranslation} from 'next-i18next';

const RestoreDataExceptionDialog = ({
  isOpened = false, corruptedData,
  handleDataReset, handleManageData,
}: {
  isOpened?: boolean, corruptedData: string
  handleDataReset: () => void, handleManageData: () => void,
}) => {
  const {t} = useTranslation('home');

  return <BuiDialog open={isOpened} >
    <BuiDialogTitle>
      {t('notifyDataCorruptionDialog.title')}
    </BuiDialogTitle>
    <DialogContent>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <div>
          {t('notifyDataCorruptionDialog.explanation')}
        </div>
      </BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <div>
          {t('notifyDataCorruptionDialog.backupAndContactUs')}
        </div>
      </BuiLinedText>
      <Box sx={{mt: 10, display: 'flex', justifyContent: 'center'}}>
        <TextField multiline fullWidth
          InputProps={{readOnly: true}}
          onFocus={(event) => {
            event.target.select();
          }}
          value={corruptedData?.length ? corruptedData : t('notifyDataCorruptionDialog.noData')}/>
      </Box>

    </DialogContent>
    <DialogActions>
      <Box sx={{flex: '1 0 0 '}}/>
      <Button variant="contained" color={'error'} onClick={handleDataReset}>
        {t('notifyDataCorruptionDialog.clearDataButton')}
      </Button>
      <Button variant="contained" color={'info'} onClick={handleManageData}>
        {t('notifyDataCorruptionDialog.openDataManagement')}
      </Button>
      <Box sx={{flex: '1 0 0 '}}/>
    </DialogActions>
  </BuiDialog>;
};

export default RestoreDataExceptionDialog;
