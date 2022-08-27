import Home from 'components/Home';
import React from 'react';
import WizAppBar from 'components/appBar/WizAppBar';
import Grid from '@mui/material/Unstable_Grid2';

export default function IndexPage() {
  return (
    <React.Fragment>
      <WizAppBar />
      <Grid container display="flex" justifyContent="center" sx={{paddingTop: '1em', paddingBottom: '2em'}}>
        <Grid xs={11} md={8} xl={6}>
          <Home/>
        </Grid>
      </Grid>

    </React.Fragment>
  );
}

