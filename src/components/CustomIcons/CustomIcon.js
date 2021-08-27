import React from "react";
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    imageIcon: {
      height: '100%'
    },
    iconRoot: {
      textAlign: 'center'
    }
  });

export const CustomIcon = ({icon}) => {
    const classes = useStyles();
    return (
    <Icon classes={{root: classes.iconRoot}}>
        <img className={classes.imageIcon} src={icon}/>
    </Icon>
    )
}