import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DataTableRow } from "components/DataTableRow_Dashboard";
import EditMonthDataModal from "./EditMonthDataModal_Dashboard";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OverlayLoading from "./OverlayLoading";
import axios from "axios";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

const baseURL = "http://localhost:8000";

function fetchUserData(userStore) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}/db/userdata_dashboard`, {
        headers: {
          Authorization: userStore.userToken,
          userId: userStore.userId,
        },
      })
      .then((response) => {
        let data = [];
        response.data.queryResult.forEach((e) => {
          data.push(e);
        });
        resolve(data);
      })
      .catch((error) => {
        console.log("err :: ", error);
        reject(error);
      });
  });
}

const groupDataByYear = (data) => {
  return data.reduce((acc, item) => {
    const year = item.date.split("-")[0];
    const existingYear = acc.find((entry) => entry.year === year);
    if (existingYear) {
      existingYear.data.push(item);
    } else {
      acc.push({ year, data: [item] });
    }
    return acc;
  }, []);
};

export default function MonthDataTable({ userData, setUserData }) {
  const userStore = useSelector((state) => state.userStore);
  const [selectedYear, setSelectedYear] = useState(null);
  const [allYear, setAllYear] = useState(null);
  const [currentYearData, setCurrentYearData] = useState(null);
  const [sumIncome, setSumIncome] = useState(null);
  const [sumExpense, setSumExpense] = useState(null);
  const [openNewMonthModal, setOpenNewMonthModal] = useState(false);

  const handleNewMonthClick = () => {
    openNewMonthModal
      ? setOpenNewMonthModal(false)
      : setOpenNewMonthModal(true);
  };

  const handleAddNewYear = async () => {
    const newYear = parseInt(allYear[allYear.length - 1]) + 1;
    setAllYear((prevYears) => [...prevYears, newYear]);
    await Promise.all([
      setSelectedYear(newYear.toString()),
      setUserData((prevUserData) => [
        ...prevUserData,
        { year: newYear.toString(), data: [] },
      ]),
    ]).then(() => {
      setCurrentYearData({ year: newYear.toString(), data: [] });
    });
  };

  useEffect(() => {
    Promise.all([fetchUserData(userStore)]).then((res) => {
      const data = res[0];
      if (data.length > 0) {
        const groupedData = groupDataByYear(data);
        const yearInData = groupedData.map((data) => data.year);
        if (yearInData.length > 0) {
          setSelectedYear(yearInData[0].toString());
          let dataYear = groupedData.find(
            (entry) => entry.year === yearInData[0]
          );
          let tmpMonthArray = dataYear.data;
          tmpMonthArray.sort((a, b) => {
            if (a.date < b.date) {
              return -1;
            }
            if (a.date > b.date) {
              return 1;
            }
            return 0;
          });
          dataYear.data = tmpMonthArray;
          setCurrentYearData(dataYear);
        }
        setAllYear(yearInData);
      } else {
        const currentDate = new Date();
        const currentYearObj = {
          data: [],
          year: currentDate.getFullYear().toString(),
        };
        setSelectedYear(currentDate.getFullYear().toString());
        setCurrentYearData(currentYearObj);
        setAllYear([currentDate.getFullYear().toString()]);
      }
    });
  }, [userStore]);

  useEffect(() => {
    if (userData && selectedYear) {
      let dataYear = userData.find((entry) => entry.year === selectedYear);
      let tmpMonthArray = dataYear.data;
      tmpMonthArray.sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
      dataYear.data = tmpMonthArray;
      setCurrentYearData(dataYear);
    }
  }, [selectedYear, userData]);

  useEffect(() => {
    if(currentYearData){
      if(currentYearData.data.length > 0){
        let tmpSumIncome = 0;
        let tmpSumExpense = 0;
        currentYearData.data.forEach(data => {
          data.expenseData.forEach(expData => {
            tmpSumExpense += parseFloat(expData.amount)
          })
          data.incomeData.forEach(incData => {
            tmpSumIncome += parseFloat(incData.amount)
          })
        })
        setSumIncome(tmpSumIncome);
        setSumExpense(tmpSumExpense)
      }
    }
  },[currentYearData])

  if (!userData || !currentYearData) {
    return <OverlayLoading isLoading={true} />;
  }

  return (
    <Container>
      <Box style={{ position: "relative" }}>
        <Typography
          variant="h5"
          style={{
            color: "#757575",
            textDecoration: "underline",
            textDecorationColor: "transparent",
            borderBottom: "2px solid #757575",
            display: "inline-block",
            width: "100%",
            paddingBottom: "8px",
            userSelect: "none",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
          sx={{
            padding: 1,
          }}
        >
          เพิ่มหรือแก้ไขข้อมูล รายรับ/รายจ่าย/การลงทุน
        </Typography>
        <Paper
          style={{
            height: 600,
            width: "100%",
          }}
        >
          <TableContainer
            style={{
              height: 600,
              // maxHeight: "30%"
            }}
          >
            <Table stickyHeader>
              <TableHead
                sx={{
                  "& th": {
                    color: "white",
                    backgroundColor: "#fc9f00",
                    fontWeight: "bold",
                    fontSize: 18,
                  },
                }}
                key={"table-header"}
              >
                <TableRow key={"table-row-header"}>
                  <TableCell style={{ width: "1%" }}></TableCell>
                  <TableCell style={{ width: "1%" }}></TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    เดือน
                  </TableCell>
                  <TableCell align="center">รายรับ</TableCell>
                  <TableCell align="center">รายจ่าย</TableCell>
                  {/* <TableCell align="center">เงินลงทุน</TableCell> */}
                  <TableCell align="center" style={{ width: "2%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentYearData.data.length > 0 ? (
                  <>
                    {currentYearData.data.map((monthData, index) => (
                      <DataTableRow
                        key={`data-table-row-${index}-${selectedYear}`}
                        dataMonth={monthData}
                        currentYearData={currentYearData}
                        userData={userData}
                        setUserData={setUserData}
                        selectedYear={selectedYear}
                        isDeleteActive={
                          parseInt(currentYearData.data.length) ===
                            parseInt(index + 1) &&
                            currentYearData.data.length !== 1
                            ? true
                            : false
                        }
                        index={index}
                      ></DataTableRow>
                    ))}
                  </>
                ) : (
                  <></>
                )}
                {currentYearData.data.length !== 12 ? (
                  <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCell
                      colSpan={7}
                      align="center"
                      onClick={(e) => {
                        handleNewMonthClick();
                      }}
                      style={{ cursor: "pointer" }}
                      key={"add-new-month-data"}
                    >
                      <IconButton
                        children={<AddCircleOutlineIcon></AddCircleOutlineIcon>}
                      ></IconButton>
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      color: "white",
                      backgroundColor: "#009e00",
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    รวม
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "black",
                      backgroundColor: "#cdf5c3",
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    {sumIncome}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "black",
                      backgroundColor: "#ffcfd5",
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    {sumExpense}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Box
            style={{
              backgroundColor: "#fc9f00",
              display: "flex",
              justifyContent: "flex-end",
              position: "relative",
              width: "100%",
            }}
          >
            <FormControl
              variant="standard"
              style={{ marginLeft: "10px", marginRight: "30px" }}
            >
              <InputLabel id="year-selection-input-label">Year</InputLabel>
              <Select
                labelId="year-selection"
                id="year-selection"
                value={selectedYear}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedYear(e.target.value.toString());
                  }
                }}
              >
                {allYear.map((item, index) => (
                  <MenuItem
                    key={index + "-menuitem-" + item + selectedYear}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ))}
                <MenuItem
                  style={{ display: "flex", justifyContent: "center" }}
                  onClick={(e) => {
                    handleAddNewYear();
                  }}
                >
                  <AddCircleOutlineIcon></AddCircleOutlineIcon>
                </MenuItem>
              </Select>
              <FormHelperText>
                Select year to create or edit data
              </FormHelperText>
            </FormControl>
          </Box>
        </Paper>
      </Box>
      <EditMonthDataModal
        show={openNewMonthModal}
        onClose={handleNewMonthClick}
        mode="newmonth"
        currentYearData={currentYearData}
        selectedYear={selectedYear}
        setCurrentYearData={setCurrentYearData}
        userData={userData}
        setUserData={setUserData}
      ></EditMonthDataModal>
    </Container>
  );
}
