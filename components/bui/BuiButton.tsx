import * as React from 'react';
import {styled} from '@mui/material/styles';
import {Button, ButtonProps} from '@mui/material';
import styles from './BuiButton.module.scss';
import variables from 'scss/variables.module.scss';


const WizCustomizedButton = styled(Button)<ButtonProps>(({theme}) => ({
  transform: `skewX(${variables.baStandardSkewX})`,
  textTransform: 'none',
}));

export default function BuiButton({backgroundColor = 'primary', ...props}: {backgroundColor?: 'primary'|'secondary'}&ButtonProps) {
  const childrenWithProps = React.Children.map(props.children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {...child.props,
        className: `${child.props.className ?? ''} revert-wiz-transform`});
    }
    return child;
  });

  const sx = {...props.sx, fontWeight: '600', fontSize: '1.1em'};
  return <WizCustomizedButton {...props}
    className={`${styles[backgroundColor]} ${props.className ?? ''}`}
    variant={props.variant ?? 'contained'} sx={sx}>{childrenWithProps}</WizCustomizedButton>;
}
