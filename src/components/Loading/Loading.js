import React from "react";
import logo from '../Assets/uoft-logo.png';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {

  return (
    <Container>
        <CircularProgress size="20%"/>
    </Container>
  );
}



export default Loading;
