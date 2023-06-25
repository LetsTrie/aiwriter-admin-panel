import React, { useEffect, useState } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const App = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCompanyList = async () => {
    setIsLoading(true);
    const companyListResponse = await fetch(
      "http://18.143.219.249:5000/admin/api/subscription/company-list"
    );
    const companyListData = await companyListResponse.json();
    setList(companyListData.members);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getCompanyList();
    })();
  }, []);

  const onPress = async (companyId) => {
    await fetch(
      `http://18.143.219.249:5000/admin/api/subscription/add/${companyId}`,
      { method: "POST" }
    );
    await getCompanyList();
  };

  if (isLoading) {
    return <p className="m-5"> Loading...</p>;
  }

  return (
    <div className="mt-3 mb-5">
      <div className="container">
        <h1 className="text-center mb-3"> AI Writer</h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Phone number</StyledTableCell>
                <StyledTableCell align="center">Subscription</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((subscription, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {subscription.company.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {subscription.user.email}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {subscription.user.phone}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {subscription.isSubscribed ? (
                      "Subscribed"
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => onPress(subscription.company._id)}
                      >
                        Subscribe
                      </Button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default App;
