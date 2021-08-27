import React, { useEffect } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import firebase from "../../services/firebase";
import Navbar from "../Navbar/Navbar"
import { sizing } from '@material-ui/system';
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";



function createData(location, price, date, startTime, endTime, uid, name, postId, reviewDisabled) {
  return { location, price, date, startTime, endTime, uid, name, postId, reviewDisabled};
}

function review(uid) {
  //history.push("/review");
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'startTime', numeric: false, disablePadding: false, label: 'Start Time' },
  { id: 'endTime', numeric: false, disablePadding: false, label: 'End Time' },
  { id: 'seller', numeric: false, disablePadding: false, label: 'Seller' },
  { id: 'review', numeric: false, disablePadding: false, label: 'Review' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <center>
      <Typography className={classes.title} variant="h6" id="tableTitle">
        Previous Transactions 
      </Typography>
    </center>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  paper: {
    width: '100%',
    height: '100%'
  },
  table: {
    width: '100%',
    height: '100%',
    minWidth: "100%",
    minHeight: "100%"
  },
  visuallyHidden: {
    border: 5,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const PreviousTransactions = ({client}) => {
  const history = useHistory();
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('price');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rows, setRow] = React.useState([]); 
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
  useEffect(() => {
    async function fetchData() {
      console.log(client.uid)
      var userRef = await firebase.firestore().collection('users').doc(client.uid).get();
	  
      var postHistory = userRef.get("purchased");
      if (!postHistory) return
      for (let i = 0; i < postHistory.length; i++){
        let post = await firebase.firestore().collection('posts').doc(postHistory[i]).get(); 
		
        let sellerRef = await firebase.firestore().collection('users').doc(post.get("uid")).get();
        
        var reviewDisabled;
        if (typeof userRef.get("reviewed") !== "undefined")
          reviewDisabled = userRef.get("reviewed").includes(postHistory[i]);
        else
          reviewDisabled = false;		
		
        let date = new Date(post.get("date").seconds * 1000),
        fromTime = new Date(post.get("fromTime").seconds * 1000),
        fromString = fromTime.toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric'}),
        toTime = new Date(post.get("toTime").seconds * 1000),
        toString = toTime.toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric'});
        
        setRow((oldArray) => [...oldArray, createData(post.get("address"), post.get("price")*(toTime.getHours()-fromTime.getHours()), date.toDateString(), fromString, toString, post.get("uid"), sellerRef.get("firstname"), postHistory[i], reviewDisabled)])
      }
      console.log("ROWS: ", rows)
    }
    fetchData() 
  }, [])


  return (
    <div>
      <Navbar/>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={0} />
        <TableContainer className={classes.paper} >
          <Table
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={0}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody className={classes.paper}>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  console.log(row)
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                    >
                        <TableCell align="left">{row.location}</TableCell>
                        <TableCell align="left">{row.price}</TableCell>
                        <TableCell align="left">{row.date}</TableCell>
                        <TableCell align="left">{row.startTime}</TableCell>
                        <TableCell align="left">{row.endTime}</TableCell>
                        <TableCell align="left">
                        <a href={"/profile/" + row.uid}>{row.name}</a>
                        </TableCell> 
                        <TableCell align="left">
                        
                        <Button variant="contained" disabled={row.reviewDisabled} color="primary" onClick={() => {console.log(row); history.push("/review", {"uid": row.uid, "name": row.name, "postId": row.postId});}}>
                          Review
                        </Button>
                        
                        </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{height: "100%"}}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            style={{right: 0 ,bottom: 0 ,position: 'absolute'}}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
      </div>
  );
}

function mapStateToProps(state) {
    return {
        client: state.firebase.auth,
    };
}

  export default connect (mapStateToProps)(PreviousTransactions);