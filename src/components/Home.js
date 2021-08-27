import React from "react";
import requireAuth from "./requireAuth";
import './Home.css';
import utm from './Assets/utm.png';
import utsg from './Assets/utsg.png';
import utsc from './Assets/utsc.png';
import logo from './Assets/uoft-logo.png';
import Navbar from "./Navbar/Navbar";
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

const tiers = [
  {
    title: 'UTSC',
    image: utsc,
    imageid: "utsc",
    description: ['10 users included', '2 GB of storage', 'Help center access', 'Email support'],
    buttonText: 'Select USTC',
    buttonVariant: 'contained',
  },
  {
    title: 'UTM',
    image: utm,
    imageid: "UTM",
    buttonText: 'Select UTM',
    buttonVariant: 'contained',
  },
  {
    title: 'UTSG',
    image: utsg,
    imageid: "UTSG",
    buttonText: 'Select UTSG',
    buttonVariant: 'contained',
  },
];

const Home = () => {
  const history = useHistory();
  const classes = useStyles();

  const goToMap = (selection) => {
    history.push('/map', {"campus": selection});
  }

  const goToMapImage = (e) => {
    goToMap(e.target.id);
  }

  const goToMapButton = (e) => {
    goToMap(e.currentTarget.id);
  }


  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          Select Your Campus
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          Why wait to find a parking spot? Pick Your Campus for speedy and affordable parking!
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card>
                <CardHeader
                  title={tier.title}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <img id={tier.imageid}  src={tier.image} onClick={goToMapImage} className="image_size" />
                </CardContent>
                <CardActions>
                  <Button id={tier.imageid} onClick={goToMapButton} fullWidth variant={tier.buttonVariant} color="primary">
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
    // return (
    //   <div>
    //     <Navbar />
    //     <div className = "headerDiv">
    //       <h1 className="choose_campus">
    //         <span>Choose Your Campus</span>
    //       </h1>
    //       <p> Why wait to find a parking spot? Pick Your Campus for speedy and affordable parking!</p>
    //     </div>
    //     <div className = "row">
    //         <div className = "column">
    //           <div className="images">
    //             <img className="image_size" src={utsc} alt="utsc" onClick = {goToMap}/>
    //           </div>
    //         </div>

    //         <div className = "column">
    //           <div className="images">
    //             <img className="image_size" src={utm} alt="UTM" onClick = {goToMap}/>
    //           </div>
    //         </div>

    //         <div className = "column">
    //           <div className="images">
    //             <img className="image_size" src = {utsg} alt = "UTSG" onClick = {goToMap}/>
    //           </div>
    //         </div>
    //     </div>
    //   </div>
    // );
}

export default Home;
