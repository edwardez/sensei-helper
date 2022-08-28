import BuiDialog from 'components/bui/dialog/BuiDialog';
import {BuiDialogTitle} from 'components/bui/dialog/BuiDialogTitle';
import {DialogContent} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import React from 'react';

const ResultIsEstimation = ({
  isOpened, onClose,
}: {
  isOpened: boolean,
  onClose: () => void
}) => {
  return <BuiDialog open={isOpened} onClose={onClose}>
    <BuiDialogTitle onClose={onClose}>Note</BuiDialogTitle>
    <DialogContent dividers>
      <BuiLinedText> <div>This is an estimation</div></BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}> <div>
          Our calculation is based on mathematical expectation, however this game drops items randomly.
This means even you sweep for the recommended times, it is likely you will not get the exact number of pieces you need.

      </div></BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}><br/></BuiLinedText>
      <BuiLinedText> <div>Recommended number doesn&apos;t add up</div></BuiLinedText>
      <BuiLinedText showVerticalDividerPrefix={false}> <div>
            It&apos;s possible you request 6 shoes but the app only gives you an estimation of 5.
          This is because the algorithm we use is&nbsp;
        <a href="https://wikipedia.org/wiki/Linear_programming" target="_blank"
          rel="noopener noreferrer">linear programming</a> and giving you the exact number is&nbsp;
        <a href="https://wikipedia.org/wiki/Integer_programming#Proof_of_NP-hardness" target="_blank"
          rel="noopener noreferrer">hard</a>. So we only give you an estimation.
      </div></BuiLinedText>
    </DialogContent>
  </BuiDialog>;
};

export default ResultIsEstimation;
