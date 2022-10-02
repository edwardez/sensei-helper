import BuiDialog from 'components/bui/dialog/BuiDialog';
import {BuiDialogTitle} from 'components/bui/dialog/BuiDialogTitle';
import {Checkbox, DialogActions, DialogContent, FormControlLabel} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {useStore} from 'stores/WizStore';
import {observer} from 'mobx-react-lite';
import BuiButton from 'components/bui/BuiButton';
import Box from '@mui/material/Box';
import variables from 'scss/variables.module.scss';
import {ChangeEvent} from 'react';
import {useTranslation} from 'next-i18next';

const InefficientRequirementWarning = ({
  isOpened,
  onCloseDialog,
}: {
  isOpened: boolean,
  onCloseDialog: () => void,
}) => {
  const {t} = useTranslation('home');
  const store = useStore();
  const handleToggleHideDialog = (e: ChangeEvent<HTMLInputElement>) =>{
    store.stageCalculationStateStore.setHideInefficientRequirementDialog(e.target.checked);
  };
  const handleToggleExcludeInefficientStages = (e: ChangeEvent<HTMLInputElement>) =>{
    store.stageCalculationStateStore.setExcludeInefficientStages(e.target.checked);
  };

  return <BuiDialog open={isOpened} onClose={() => onCloseDialog()}>
    <BuiDialogTitle onClose={() => onCloseDialog()}>
      {t('thinsToNote.avoidInefficientStages')}
    </BuiDialogTitle>

    <DialogContent>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <div>
          {t('thinsToNote.inefficientExamples')}
        </div>
      </BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <br/>
      </BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <div>
          {t('thinsToNote.howToAvoidInefficacy')}
        </div>
      </BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <br/>
      </BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <div>
          {t('thinsToNote.youCanChangeInefficientSettings')}
        </div>
      </BuiLinedText>

    </DialogContent>
    <DialogActions sx={{display: 'flex', m: 2}}>

      <div>
        <FormControlLabel
          color={'baTextButtonPrimary'} control={<Checkbox color={'baTextButtonPrimary'} checked={store.stageCalculationStateStore.requirementInefficacy.hideInefficientRequirementDialog}
            onChange={handleToggleHideDialog} />}
          sx={{color: variables.baPrimaryTextColor}}
          label={t('thinsToNote.dontShowThisAgainCheckBox')}
        />
        <FormControlLabel
          color={'baTextButtonPrimary'} control={<Checkbox color={'baTextButtonPrimary'} checked={store.stageCalculationStateStore.requirementInefficacy.excludeInefficientStages}
            onChange={handleToggleExcludeInefficientStages} />}
          sx={{color: variables.baPrimaryTextColor}}
          label={t('thinsToNote.excludeInefficientStagesCheckBox')} />
      </div>
      <Box sx={{flex: '1 0 0'}} />
      <BuiButton color={'baButtonPrimary'} onClick={onCloseDialog}>Close</BuiButton>
    </DialogActions>
  </BuiDialog>;
};

export default observer(InefficientRequirementWarning);
