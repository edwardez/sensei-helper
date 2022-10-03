import BuiDialog from 'components/bui/dialog/BuiDialog';
import {BuiDialogTitle} from 'components/bui/dialog/BuiDialogTitle';
import {Checkbox, DialogActions, DialogContent, FormControlLabel} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {useStore} from 'stores/WizStore';
import {observer} from 'mobx-react-lite';
import BuiButton from 'components/bui/BuiButton';
import Box from '@mui/material/Box';
import variables from 'scss/variables.module.scss';
import {ChangeEvent, useState} from 'react';
import {useTranslation} from 'next-i18next';

/**
 * Executes when dialog is closed.
 * Note `isExcludeInefficientStagesDirty` is true even user has changed the value twice.
 * (changed value then reverted it back).
 */
export type OnCloseInefficacyDialog = (isExcludeInefficientStagesDirty: boolean) => void;

const InefficientRequirementWarning = ({
  isOpened,
  onCloseDialog,
}: {
  isOpened: boolean,
  onCloseDialog: OnCloseInefficacyDialog,
}) => {
  const {t} = useTranslation('home');
  const store = useStore();
  const [isExcludeInefficientStagesDirty, setIsExcludeInefficientStagesDirty] = useState(false);
  const handleToggleHideDialog = (e: ChangeEvent<HTMLInputElement>) =>{
    store.stageCalculationStateStore.setHideInefficientRequirementDialog(e.target.checked);
  };
  const handleToggleExcludeInefficientStages = (e: ChangeEvent<HTMLInputElement>) =>{
    store.stageCalculationStateStore.setExcludeInefficientStages(e.target.checked);
    setIsExcludeInefficientStagesDirty(true);
  };

  const handleCloseDialog = () => onCloseDialog(isExcludeInefficientStagesDirty);

  return <BuiDialog open={isOpened} onClose={handleCloseDialog}>
    <BuiDialogTitle onClose={handleCloseDialog}>
      {t('thinsToNote.avoidInefficientStages')}
    </BuiDialogTitle>

    <DialogContent>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <div>
          {t('thinsToNote.inefficientExamples')}
          &nbsp;<a href="https://bluearchive.wikiru.jp/?%E8%A3%85%E5%82%99%E4%B8%80%E8%A6%A7" rel="noopener noreferrer"
            target="_blank">
            {t('thinsToNote.inefficientStagesReferencesLink')}</a>
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
      <BuiButton sx={{flex: '1 0 auto'}} color={'baButtonPrimary'} onClick={handleCloseDialog}>{t('closeButton')} </BuiButton>
    </DialogActions>
  </BuiDialog>;
};

export default observer(InefficientRequirementWarning);
