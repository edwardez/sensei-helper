import Home from 'components/Home';
import React from 'react';
import BasAppBar from 'components/bui/appBar/BasAppBar';

export default function IndexPage() {
  return (
    <React.Fragment>
      <BasAppBar />
      <Home/>
    </React.Fragment>
  );
}

