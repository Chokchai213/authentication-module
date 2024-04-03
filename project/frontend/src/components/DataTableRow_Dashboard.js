import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableHead } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import EditMonthDataModal from "./EditMonthDataModal_Dashboard";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { formatNumberWithCommas, roundNumber } from "utils/numberUtil";
import axios from "axios";

const baseURL = "http://localhost:8000";

const taxableIncome = [
    {
        name: "เงินได้ประเภทที่ 1",
        category: 1,
        label: "เงินเดือน",
    },
    {
        name: "เงินได้ประเภทที่ 2",
        category: 2,
        label: "ค่าจ้างทั่วไป",
    },
    {
        name: "เงินได้ประเภทที่ 3",
        category: 3,
        label: "ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา",
        subcategory: [
            {
                subcategorylabel:
                    "ค่าลิขสิทธิ์/ค่าลิขสิทธิ์และทรัพย์สินทางปัญญา/ค่าGoodwill",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 50% แต่ไม่เกิน 100,000 บาท หรือหักตามจริง",
            },
            {
                subcategorylabel: "เงินปีและเงินรายปีจากนิติกรรมหรือคำพิพากษาของศาล",
                subcategorycategory: 2,
                subcategoryinfo: "-",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 4",
        category: 4,
        label: "ดอกเบี้ย/เงินปันผล/ผลประโยชน์จากการลงทุน",
    },
    {
        name: "เงินได้ประเภทที่ 5",
        category: 5,
        label: "เงินได้จากการให้เช่าทรัพย์สิน",
        subcategory: [
            {
                subcategorylabel: "ค่าเช่าบ้าน/อาคาร/ตึก/สิ่งปลูกสร้าง/แพ",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าที่ดินเกษตรกรรม",
                subcategorycategory: 2,
                subcategoryinfo: "หักแบบเหมา 20% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าที่ดินไม่ใช้ในเกษตรกรรม",
                subcategorycategory: 3,
                subcategoryinfo: "หักแบบเหมา 15% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่ายานพาหนะ",
                subcategorycategory: 4,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
            {
                subcategorylabel: "ค่าเช่าอื่นๆ",
                subcategorycategory: 5,
                subcategoryinfo: "หักแบบเหมา 10% หรือหักตามจริง",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 6",
        category: 6,
        label: "เงินได้จากวิชาชีพอิสระ",
        subcategory: [
            {
                subcategorylabel: "การประกอบโรคศิลปะ",
                subcategorycategory: 1,
                subcategoryinfo: "หักแบบเหมา 60% หรือหักตามจริง",
            },
            {
                subcategorylabel: "กฎหมาย/วิศวกรรม/สถาปัตยกรรม/บัญชี/ประณีตศิลปกรรม",
                subcategorycategory: 2,
                subcategoryinfo: "หักแบบเหมา 30% หรือหักตามจริง",
            },
        ],
    },
    {
        name: "เงินได้ประเภทที่ 7",
        category: 7,
        label: "เงินได้จากการรับเหมา (ก่อสร้าง/รับผลิตสินค้า)",
    },
];

const expenseType = [
    {
        name: "อาหาร",
        category: 1,
        color: "#95c2dc",
        index: 1
    },
    {
        name: "ที่พักอาศัย",
        category: 2,
        color: "#ec843e",
        index: 2
    },
    {
        name: "สิ่งบันเทิง",
        category: 3,
        color: "#e7dc8c",
        index: 3
    },
    {
        name: "ท่องเที่ยว",
        category: 4,
        color: "#84ceb9",
        index: 4
    },
    {
        name: "การศึกษา",
        category: 5,
        color: "#6681a5",
        index: 5
    },
    {
        name: "ค่าเดินทาง",
        category: 6,
        color: "#fb7d7e",
        index: 6
    },
    {
        name: "ค่าใช้จ่ายจิปาถะ",
        category: 7,
        color: "#485ea1",
        index: 7
    },
    {
        name: "อื่นๆ",
        category: 8,
        color: "#b7f1a5",
        index: 8
    },
];

async function deleteCurrentMonthData(
    dataMonth,
    userData,
    setUserData,
    userStore
) {
    await axios.post(
        `${baseURL}/db/delete_monthly`,
        {
            month: dataMonth.month,
            year: dataMonth.year,
        },
        {
            headers: {
                Authorization: userStore.userToken,
                UserId: userStore.userId,
            },
        }
    );
    const resFetchNewData = await axios.get(`${baseURL}/db/userdata_dashboard`, {
        headers: {
            Authorization: userStore.userToken,
            userId: userStore.userId,
            year: dataMonth.year,
        },
    });
    modifyUserDataByYear(
        dataMonth.year,
        resFetchNewData.data.queryResult,
        setUserData
    );
}

function modifyUserDataByYear(yearToChange, newData, setUserData) {
    setUserData((prevState) => {
        return prevState.map((entry) => {
            if (entry.year === yearToChange) {
                return { ...entry, data: newData };
            }
            return entry;
        });
    });
}

export const DataTableRow = ({
    dataMonth,
    userData,
    setUserData,
    selectedYear,
    isDeleteActive,
    index
}) => {
    const userStore = useSelector((state) => state.userStore);
    const [openModal, setOpenModal] = useState(false);
    const handleEditClick = () => {
        openModal ? setOpenModal(false) : setOpenModal(true);
    };
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [open, setOpen] = React.useState(false);
    const tmp = 0;

    const onClickDelete = (e) => {
        openDeleteModal ? setOpenDeleteModal(false) : setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = (e) => {
        setOpenDeleteModal(false);
    };

    const handleDeleteCurrentMonth = async (e) => {
        await deleteCurrentMonthData(dataMonth, userData, setUserData, userStore);
        setOpenDeleteModal(false);
    };
    return (
        <React.Fragment key={"fragment-parent-table-row-"+dataMonth.date}>
            <TableRow 
            sx={{ backgroundColor : index%2===0 ? "white" : "#efefef"}}
            >
                <TableCell >
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <IconButton
                        children={<EditIcon></EditIcon>}
                        onClick={(e) => {
                            handleEditClick();
                        }}
                    ></IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                    {new Date(dataMonth.date).toLocaleString("th-TH", {
                        month: "long",
                    })}
                </TableCell>
                <TableCell align="center">
                    {formatNumberWithCommas(dataMonth.incomeData.reduce(
                        (sum, current) => parseFloat(sum) + parseFloat(current.amount),
                        tmp
                    ))}
                </TableCell>
                <TableCell align="center">
                    {formatNumberWithCommas(dataMonth.expenseData.reduce(
                        (sum, current) => parseFloat(sum) + parseFloat(current.amount),
                        tmp
                    ))}
                </TableCell>
                {/* <TableCell align="center">{formatNumberWithCommas(dataMonth.investmentData)}</TableCell> */}

                {/* delete button */}
                <TableCell align="center" style={{ width: "2%" }}
                >
                    <>
                        {isDeleteActive ? (
                            <IconButton
                                children={<DeleteIcon style={{ color: "red" }}></DeleteIcon>}
                                onClick={(e) => {
                                    onClickDelete(e);
                                }}
                            ></IconButton>
                        ) : (
                            <DeleteIcon style={{ color: "grey" }} />
                        )}
                    </>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <div style={{ display: "flex" }}>
                                {/* Sub Table Income, Investment, Expense */}
                                <Table className="sub-table" key={"sub-table-"+dataMonth.date}>
                                    <TableHead key={"table-head-sub-table-"+dataMonth.date}>
                                        <TableRow key={"sub-table-header-row-"+dataMonth.date}>
                                            <TableCell
                                                align="center"
                                                colSpan={3}
                                                style={{ fontSize: "12pt" }}
                                                sx={{
                                                    backgroundColor: "#CBFFA9",
                                                }}
                                            >
                                                รายรับเดือนนี้
                                            </TableCell>
                                        </TableRow>
                                        <TableRow key={"sub-table-header-" + dataMonth.date}>
                                            <TableCell
                                                align="center"
                                                key={"header-amount-" + dataMonth.date}
                                            >
                                                จำนวน&nbsp;(บาท)
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                key={"header-type-" + dataMonth.date}
                                            >
                                                ประเภท
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                key={"header-subtype-" + dataMonth.date}
                                            >
                                                ประเภทย่อย
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataMonth.incomeData.map((item, index) => (
                                            <TableRow key={item.type + index + "-row-"+selectedYear}>
                                                <TableCell
                                                    key={item.amount + index + "-income-" + selectedYear}
                                                    align="center"
                                                >
                                                    {formatNumberWithCommas(item.amount)}
                                                </TableCell>
                                                <TableCell
                                                    key={
                                                        item.type + index + "-income-type-" + selectedYear
                                                    }
                                                    align="center"
                                                >
                                                    {item.type}
                                                </TableCell>
                                                <TableCell
                                                    key={item.amount + Math.random(10, 10)}
                                                    align="center"
                                                >
                                                    -
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Table className="sub-table">
                                    <TableHead>
                                        <TableRow key={"sub-table-head-row-expense-"+dataMonth.date}>
                                            <TableCell
                                                align="center"
                                                colSpan={2}
                                                style={{ fontSize: "12pt" }}
                                                sx={{
                                                    backgroundColor: "#FF9B9B",
                                                }}
                                            >
                                                รายจ่ายเดือนนี้
                                            </TableCell>
                                        </TableRow>
                                        <TableRow key={"sub-table-head-row-expense-amount-type-"+dataMonth.date}>
                                            <TableCell align="center">จำนวน&nbsp;(บาท)</TableCell>
                                            <TableCell align="center">ประเภท</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataMonth.expenseData.map((item, index) => (
                                            <TableRow key={"sub-table-cell-"+item.amount+"-"+index+"-"+dataMonth.date}>
                                                <TableCell
                                                    key={item.amount + index + dataMonth.date}
                                                    align="center"
                                                >
                                                    {formatNumberWithCommas(item.amount)}
                                                </TableCell>
                                                <TableCell
                                                    key={item.type + index + dataMonth.date}
                                                    align="center"
                                                >
                                                    {item.type}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <EditMonthDataModal
                show={openModal}
                dataMonth={dataMonth}
                onClose={handleEditClick}
                mode="editexisting"
                userData={userData}
                setUserData={setUserData}
                selectedYear={selectedYear}
            ></EditMonthDataModal>
            <Modal show={openDeleteModal} backdrop="static">
                <Modal.Header closeButton onHide={handleCloseDeleteModal}>
                    <Modal.Title>Deleting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {dataMonth.date}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={(e) => {
                            handleCloseDeleteModal();
                        }}
                    >
                        No
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={(e) => {
                            handleDeleteCurrentMonth();
                        }}
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};
