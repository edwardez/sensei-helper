import BuiDialog from 'components/bui/dialog/BuiDialog';
import {BuiDialogTitle} from 'components/bui/dialog/BuiDialogTitle';
import {DialogContent} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import React from 'react';
import {Trans, useTranslation} from 'next-i18next';

const ResultIsEstimation = ({
  isOpened, onClose,
}: {
  isOpened: boolean,
  onClose: () => void
}) => {
  const {t} = useTranslation('home');

  return <BuiDialog open={isOpened} onClose={onClose}>
    <BuiDialogTitle onClose={onClose}>{t('thinsToNote.dialogTitle')}</BuiDialogTitle>
    <DialogContent dividers>
      <BuiLinedText> <div>{t('thinsToNote.dialogThisIsEstimationTitle')}</div></BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}> <div>
        {t('thinsToNote.dialogThisIsEstimationContent')}
      </div></BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}><br/></BuiLinedText>
      <BuiLinedText> <div>{t('thinsToNote.dialogNumberMayNotAddUpTitle')}</div></BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}>
        <div>
          <Trans t={t} i18nKey={'thinsToNote.dialogNumberMayNotAddUpContent'}>
            It&apos;s possible you request 6 shoes but the app only gives you an estimation of 5.
            This is because the algorithm we use is&nbsp;
            <a href="https://wikipedia.org/wiki/Linear_programming" target="_blank"
              rel="noopener noreferrer">linear programming</a> and giving you the exact number is&nbsp;
            <a href="https://wikipedia.org/wiki/Integer_programming#Proof_of_NP-hardness" target="_blank"
              rel="noopener noreferrer">hard</a>. So we only give you an estimation.
          </Trans>
        </div>

      </BuiLinedText>
    </DialogContent>
  </BuiDialog>;
};

export default ResultIsEstimation;
