import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
// import { calcs } from "grommet";
import Grid from "@mui/material/Grid";
import "./editMonthDataModal.css";
import { current } from "@reduxjs/toolkit";
let monthString;
let year;
let month;
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

const EditMonthDataModal = ({
    show,
    onClose,
    clickedMonth,
    mode,
    currentYearData,
    selectedYear,
}) => {
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [investmentData, setInvestmentData] = useState([]);

    const handleAddIncomeData = () => {
        setIncomeData((prevIncomeData) => [...prevIncomeData, {}]);
    };

    const handleIncomeAmountChange = (e, index) => { };

    const handleIncomeTypeChange = (e, index) => { };

    if (show === true && mode === "editexisting") {
        year = new Date(clickedMonth.date).getFullYear();
        month = new Date(clickedMonth.date).getMonth();
        monthString = new Date(clickedMonth.date).toLocaleString("en-us", {
            month: "long",
        });
    }
    let newMonthString;
    let newYearString;

    if (currentYearData && currentYearData.data.length && mode === "newmonth") {
        const lastDateTime = new Date(
            currentYearData.data[currentYearData.data.length - 1].date
        );
        lastDateTime.setMonth(lastDateTime.getMonth() + 1);
        [newMonthString, newYearString] = [
            new Date(lastDateTime).toLocaleString("en-us", { month: "long" }),
            lastDateTime.getFullYear().toString(),
        ];
    } else if (currentYearData) {
        [newMonthString, newYearString] = [
            new Date(new Date().setMonth(currentYearData.data.length)).toLocaleString(
                "en-us",
                { month: "long" }
            ),
            selectedYear,
        ];
    }

    return (
        <Modal
            show={show}
            onHide={() => {
                setIncomeData([]);
                onClose();
            }}
            backdrop="static"
            className="edit-modal"
        >
            <Modal.Header closeButton>
                {mode === "editexisting" ? (
                    <Modal.Title>
                        Editing {monthString} of {year}
                    </Modal.Title>
                ) : currentYearData ? (
                    <Modal.Title>
                        Adding {newMonthString} of {newYearString}
                    </Modal.Title>
                ) : null}
            </Modal.Header>
            <Modal.Body>
                <Container
                    style={{ overflowY: "auto", maxHeight: `calc(100vh - 200px)` }}
                >
                    <Row>
                        <Col md={6}>
                            <div>
                                <Typography
                                    variant="h4"
                                    style={{
                                        color: "#757575",
                                        textDecoration: "underline",
                                        textDecorationColor: "transparent",
                                        borderBottom: "2px solid #757575",
                                        display: "inline-block",
                                        width: "100%",
                                        paddingBottom: "8px",
                                        userSelect: "none",
                                    }}
                                >
                                    Income
                                </Typography>
                                <Typography
                                    variant="h8"
                                    style={{
                                        color: "#757575",
                                        textDecorationColor: "transparent",
                                        width: "100%",
                                        userSelect: "none",
                                    }}
                                >
                                    Add/Edit Source of Income
                                </Typography>
                            </div>
                            <Container>
                                {incomeData.length > 0 ? (
                                    incomeData.map((data, index) => (
                                        <Grid container spacing={2} key={index} alignItems="center">
                                            {/* index */}
                                            <Grid item>
                                                <Typography>{index + 1 + "."}</Typography>
                                            </Grid>
                                            {/* income amount */}
                                            <Grid item>
                                                <TextField
                                                    required
                                                    id={"outlined-required" + index}
                                                    label="รายได้"
                                                    size="small"
                                                    margin="normal"
                                                    onChange={(e) => {
                                                        handleIncomeAmountChange(e, index);
                                                    }}
                                                />
                                            </Grid>
                                            {/* income type */}
                                            <Grid item>
                                                <FormControl
                                                    variant="standard"
                                                    sx={{ m: 1, minWidth: 150 }}
                                                >
                                                    <InputLabel id="demo-simple-select-standard-label">
                                                        ประเภทของรายได้
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-standard-label"
                                                        id="demo-simple-select-standard"
                                                        onChange={(e) => {
                                                            handleIncomeTypeChange(e, index);
                                                        }}
                                                        label="ประเภทของรายได้"
                                                    >
                                                        {taxableIncome.map((type) => (
                                                            <MenuItem
                                                                value={type.name}
                                                                key={type.name + index}
                                                            >
                                                                {type.name}{" "}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </Container>
                            <Row>
                                <Button
                                    variant="text"
                                    children={<AddCircleOutlineIcon></AddCircleOutlineIcon>}
                                    onClick={(e) => {
                                        handleAddIncomeData();
                                    }}
                                ></Button>
                            </Row>
                            <Typography
                                variant="h4"
                                style={{
                                    color: "#757575",
                                    textDecoration: "underline",
                                    textDecorationColor: "transparent",
                                    borderBottom: "2px solid #757575",
                                    display: "inline-block",
                                    width: "100%",
                                    paddingBottom: "8px",
                                }}
                            >
                                Investment
                            </Typography>
                            <Typography
                                variant="h8"
                                style={{
                                    color: "#757575",
                                    textDecorationColor: "transparent",
                                    width: "100%",
                                }}
                            >
                                Add Investment Amount
                            </Typography>
                        </Col>

                        <Col md={6}>
                            <div>
                                <Typography
                                    variant="h4"
                                    style={{
                                        color: "#757575",
                                        textDecoration: "underline",
                                        textDecorationColor: "transparent",
                                        borderBottom: "2px solid #757575",
                                        display: "inline-block",
                                        width: "100%",
                                        paddingBottom: "8px",
                                    }}
                                >
                                    Expense
                                </Typography>
                                <Typography
                                    variant="h8"
                                    style={{
                                        color: "#757575",
                                        textDecorationColor: "transparent",
                                        width: "100%",
                                    }}
                                >
                                    Add/Edit Your Personal Expense
                                </Typography>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setIncomeData([]);
                        onClose();
                    }}
                >
                    Close
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditMonthDataModal;
