import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFirebase } from 'react-redux-firebase'
import { CustomIcon } from '../CustomIcons/CustomIcon';
import logoIcon from "../Assets/logoIcon.svg";

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import StreetviewIcon from '@material-ui/icons/Streetview';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useHistory } from "react-router-dom";

import firebase from "../../services/firebase";


const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const NavBar = ({}) => {
  const history = useHistory()
  const fb = useFirebase(); 
  const [user, setUser] = useState(firebase.auth().currentUser);
  if (!user) {
    setUser({
      isEmpty: true
    })
  }
  
  var uid = firebase.auth().currentUser;
  if(uid) uid = uid.uid;
  
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [numOfNotifiation, setNumNotification] = useState(0)
  const [trigger, setTrigger] = useState(false)

  const [mobileProfileIcon, setMobileProfileIcon] = useState(null); 
  const [webProfileIcon, setWebProfileIcon] = useState(null); 
  const [mobileDropDown, setMobileDropDown] = useState(null);
  const [webDropDown, setWebDropDown] = useState(null);

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
  const handleLogOut = async () => {
    await firebase.auth().signOut()
      toLogin()
  }

  const handleNotificationClick = () => {
    history.push("/chat/"+user.uid)
  }

  const toLogin = () => {
    history.push("/login")
  }

  const toHome = () => {
    history.push("/")
  }

  const toRegister = () => {
    history.push("/registeration")
  }

  const toMaps = () => {
    history.push("/map", {"campus": "utm"})
  }

  const toProfile = () => {
    history.push("/profile")
  }

  const toPostHistory = () => {
    history.push("/PostHistory")
  }

  const toTransactions = () => {
    history.push("/prevTransaction")
  }
  const toPost = () => {
    history.push("/post")
  }

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const createIconButton = (icon, onClickHandler) => {
    return (
    <IconButton
    edge="end"
    aria-label="account of current user"
    aria-controls={menuId}
    aria-haspopup="true"
    onClick={onClickHandler}
    color="inherit">
    {icon}
    </IconButton>
    );
  }

  const renderMenu = (user && !user.isEmpty) ? 
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={ toProfile }>View profile</MenuItem>
      <MenuItem onClick={ toTransactions }>View purchases</MenuItem>
	  <MenuItem onClick={ toPostHistory }>View your posts</MenuItem>
      <MenuItem onClick={() => history.push("/reviews/" + uid)}>View reviews</MenuItem>
	  <MenuItem onClick={ handleLogOut }>Logout</MenuItem>
    </Menu>
  :
    <Menu
    anchorEl={anchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    id={menuId}
    keepMounted
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={isMenuOpen}
    onClose={handleMenuClose}>
      <MenuItem onClick={toLogin}>Login</MenuItem>
      <MenuItem onClick={ toRegister }>Register</MenuItem>
    </Menu>

  useEffect(() => {
    // If person is logged in render this menu
    if (!user) return 
    if (!user.isEmpty) {
      setWebProfileIcon(createIconButton(<CustomIcon icon={user.photoURL} />, handleProfileMenuOpen));
      setMobileProfileIcon(createIconButton(<CustomIcon icon={user.photoURL} />, handleMobileMenuOpen));
    } else {
      setWebProfileIcon(createIconButton(<AccountCircle />, handleProfileMenuOpen));
      setMobileProfileIcon(createIconButton(<AccountCircle />, handleMobileMenuOpen));
    }
}, [user])

  const renderMobileMenu = (user && !user.isEmpty) ? 
    <Menu
    anchorEl={mobileMoreAnchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    id={mobileMenuId}
    keepMounted
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={isMobileMenuOpen}
    onClose={handleMobileMenuClose}>
      <MenuItem onClick={handleNotificationClick}>
        {/* TODO: Have this redirect to the messaging page if clicked on*/}
        <IconButton aria-label={`show ${numOfNotifiation} new notifications`} color="inherit">
          <Badge badgeContent={numOfNotifiation} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      {/* TODO: Have this redirect to the profile page */}
      <MenuItem onClick={handleProfileMenuOpen}>
        {mobileProfileIcon}
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={handleLogOut}>
        {mobileProfileIcon}
        <p>Logout</p>
      </MenuItem>
    </Menu>
  :
  <Menu
  anchorEl={mobileMoreAnchorEl}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  id={mobileMenuId}
  keepMounted
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  open={isMobileMenuOpen}
  onClose={handleMobileMenuClose}>
    <MenuItem onClick={ toLogin }>
      {mobileProfileIcon}
      <p>Login</p>
    </MenuItem>
    <MenuItem onClick={ toRegister }>
      {mobileProfileIcon}
      <p>Register</p>
    </MenuItem>
  </Menu>

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick = {toHome}
            >
              <CustomIcon icon={logoIcon} />
          </IconButton>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick = {toMaps}
            >
              <StreetviewIcon />
          </IconButton>
          {(!user || user.isEmpty) ? null :
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick = {toPost}
            >
              <AddLocationIcon />
          </IconButton>}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {(!user || user.isEmpty) ? null :
            <IconButton onClick={handleNotificationClick} aria-label={`show ${numOfNotifiation} new notifications`} color="inherit">
              <Badge badgeContent={numOfNotifiation} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>}
            {webProfileIcon}
          </div>
          <div className={classes.sectionMobile}>
            {mobileProfileIcon}
          </div>
        </Toolbar>
      </AppBar>
      { renderMobileMenu }
      { renderMenu }
    </div>
  );
}

export default (NavBar);
