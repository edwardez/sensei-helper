import styles from 'components/bui/dialog/BuiDialogTitle.module.scss';
import {DialogTitle} from '@mui/material';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

export interface DialogTitleProps {
  children?: React.ReactNode;
  onClose?: () => void;
}

export const BuiDialogTitle = (props: DialogTitleProps) => {
  const {children, onClose, ...other} = props;

  return (
    <DialogTitle sx={{m: 0, p: 2}} {...other} className={styles.titleText}>
      <Box display={'flex'} justifyContent={'center'}>
        {children}

      </Box>
      {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
      ) : null}
    </DialogTitle>
  );
};
