import Home from 'components/Home';
import React from 'react';
import BasAppBar from 'components/bui/appBar/BasAppBar';
import Grid from '@mui/material/Unstable_Grid2';

export default function IndexPage() {
  return (
    <React.Fragment>
      <BasAppBar />
      <Grid container display="flex" justifyContent="center" >
        <Grid xs={11} md={8} xl={6}>
          <Home/>
        </Grid>
      </Grid>

    </React.Fragment>
  );
}

