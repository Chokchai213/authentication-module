import React from 'react';
import PropTypes from 'prop-types';
import { Container } from "react-bootstrap";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Navigate from "components/Navbar";
import TextField from '@mui/material/TextField';
import IncomeTable from 'components/IncomeTable';
import ExpenseBenefitTable from 'components/ExpenseBenefitTable';
import UserFundTable from 'components/userFundTable';
import StartIcon from '@mui/icons-material/Start';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";
import { Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Footer } from 'components/Footer';
import Modal from "@mui/material/Modal";


////// มึงไปแก้ให้มันกดเข้ามาได้อยู่ แต่ handle case ที่มันไม่มี data แล้วมึงรบกวนช่วยบอก user ด้วยว่ามันไม่มี data ให้มึงกลับไปกรอกมาก่อน
export function calTax(netIncome) {
    let tax;
    if (netIncome <= 150000) {
        tax = 0;
    } else if (netIncome > 150000 && netIncome <= 300000) {
        tax = (netIncome - 150000) * 0.05;
    } else if (netIncome > 300000 && netIncome <= 500000) {
        tax = (netIncome - 300000) * 0.1 + 7500;
    } else if (netIncome > 500000 && netIncome <= 750000) {
        tax = (netIncome - 500000) * 0.15 + 27500;
    } else if (netIncome > 750000 && netIncome <= 1000000) {
        tax = (netIncome - 750000) * 0.2 + 65000;
    } else if (netIncome > 1000000 && netIncome <= 2000000) {
        tax = (netIncome - 1000000) * 0.25 + 115000;
    } else if (netIncome > 2000000 && netIncome <= 5000000) {
        tax = (netIncome - 2000000) * 0.3 + 365000;
    } else if (netIncome > 5000000) {
        tax = (netIncome - 5000000) * 0.35 + 1265000;
    }
    return tax;
}

export function TaxCal() {

    const uid = useSelector(state => state.userStore.userId)
    const navigate = useNavigate();

    const [isloading, setIsloading] = React.useState(true);

    const [warning1, setWarning1] = React.useState(false);
    const [warning2, setWarning2] = React.useState(false);

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [open3, setOpen3] = React.useState(false);
    const [open4, setOpen4] = React.useState(false);
    const [open5, setOpen5] = React.useState(false);
    const [open6, setOpen6] = React.useState(false);

    const [personal, setPersonal] = React.useState('');
    const [personal1, setPersonal1] = React.useState('60000');
    const [personal2, setPersonal2] = React.useState('');
    const [personal3, setPersonal3] = React.useState('');
    const [personal4, setPersonal4] = React.useState('');
    const [personal5, setPersonal5] = React.useState('');
    const [personal6, setPersonal6] = React.useState('');

    const [insurance, setInsurance] = React.useState('');
    const [insurance1, setInsurance1] = React.useState('');
    const [insurance2, setInsurance2] = React.useState('');
    const [insurance3, setInsurance3] = React.useState('');
    const [insurance4, setInsurance4] = React.useState('');
    const [insurance5, setInsurance5] = React.useState('');
    const [insurance6, setInsurance6] = React.useState('');
    const [insurance7, setInsurance7] = React.useState('');
    const [insurance8, setInsurance8] = React.useState('');
    const [insurance9, setInsurance9] = React.useState('');

    const [charity, setCharity] = React.useState('');
    const [charities, setCharities] = React.useState([
        { name: 'เงินบริจาคทั่วไป', value: '' },
        { name: 'เงินบริจาคเพื่อการศึกษา การกีฬา การพัฒนาสังคม เพื่อประโยชน์สาธารณะ และบริจาคเพื่อสถานพยาบาลของรัฐ', value: '' },
        { name: 'เงินบริจาคให้กับพรรคการเมือง', value: '' }
    ]);

    const handleCharityChange = (index, value) => {
        const updatedCharities = [...charities];
        updatedCharities[index].value = value;
        setCharities(updatedCharities);
    };

    const [tax, setTax] = React.useState(0);


    const [benefitObj, setBenefitObj] = React.useState(0);
    const [incomeObj, setIncomeObj] = React.useState(0);
    const [incomeSum, setIncomeSum] = React.useState(0);
    const [benefitSum, setBenefitSum] = React.useState(0);



    const [fund, setFund] = React.useState('');
    const [totalReduce, setTotalReduce] = React.useState('');

    const [data, setData] = React.useState([]);
    const [isEnoughData, setIsEnoughData] = React.useState();
    React.useEffect(() => {
        setIsloading(true)
        async function fetchData() {
            if (uid != null && data.length === 0) {
                await axios
                    .get(`http://localhost:8000/db/userdata=${uid}`)
                    .then((response) => {
                        if (response.data.length != 12) {
                            setIsEnoughData(false);
                        } else {
                            setIsEnoughData(true);
                            setData(response.data);
                        }
                    });
            }
        }
        fetchData();
        makeIncomeArr();
        //console.log(tax)
    }, [uid, data]);

    const [arr, setArr] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            if (arr.length === 0) {
                let sumFund = 0;
                await axios
                    .get(`http://localhost:8000/db/userassets=${uid}`)
                    .then((response) => {
                        console.log(response.data)
                        if (response.data.length > 0) {
                            const filteredAssets = response.data
                                .map((obj) => {
                                    return obj.Funds.filter((fund) => {
                                        if (fund.spec_code) {
                                            return (
                                                fund.spec_code.includes("SSF") ||
                                                fund.spec_code.includes("RMF")
                                            );
                                        }
                                    });
                                })
                                .flat(1);

                            setArr(filteredAssets);

                            // Calculating sum using filtered assets
                            filteredAssets.forEach(asset => {
                                sumFund += Number(asset.amount);
                            });
                            setFund(sumFund);
                            console.log(sumFund)
                        }
                    });
                await axios.post(`http://localhost:8000/db/get_user_tax`, { userId: uid })
                    .then(res => {
                        if (res.data[0] && res.data[0].reductionField) {
                            const reduction = res.data[0].reductionField;
                            setPersonal1(reduction.personal1);
                            setPersonal2(reduction.personal2);
                            setPersonal3(reduction.personal3);
                            setPersonal4(reduction.personal4);
                            setPersonal5(reduction.personal5);
                            setPersonal6(reduction.personal6);
                            setInsurance1(reduction.insurance1);
                            setInsurance2(reduction.insurance2);
                            setInsurance3(reduction.insurance3);
                            setInsurance4(reduction.insurance4);
                            setInsurance5(reduction.insurance5);
                            setInsurance6(reduction.insurance6);
                            setInsurance7(reduction.insurance7);
                            setInsurance8(reduction.insurance8);
                            setInsurance9(reduction.insurance9);
                            setCharities(reduction.charities);
                        }
                    })
            }
        }
        fetchData();
    }, [uid]);


    const [saved, setSaved] = React.useState(true)
    React.useEffect(() => {
        //setIsloading(true)
        const sumPersonal = Number(personal1.replace(/,/g, '') || 0) + Number(personal2.replace(/,/g, '') || 0) + Number(personal3.replace(/,/g, '') || 0) + Number(personal4.replace(/,/g, '') || 0) + Number(personal5.replace(/,/g, '') || 0) + Number(personal6.replace(/,/g, '') || 0);
        setPersonal(sumPersonal);
        const sumInsurance = Number(insurance1.replace(/,/g, '') || 0) + Number(insurance2.replace(/,/g, '') || 0) + Number(insurance3.replace(/,/g, '') || 0) + Number(insurance4.replace(/,/g, '') || 0) + Number(insurance5.replace(/,/g, '') || 0) + Number(insurance6.replace(/,/g, '') || 0) + Number(insurance7.replace(/,/g, '') || 0) + Number(insurance8.replace(/,/g, '') || 0) + Number(insurance9.replace(/,/g, '') || 0);
        setInsurance(sumInsurance);
        const sumCharity = charities.reduce((acc, charity) => acc + Number(charity.value.replace(/,/g, '') || 0), 0);
        setCharity(sumCharity);
        const sumAll = Number(personal || 0) + Number(insurance || 0) + Number(charity || 0);
        setTotalReduce(sumAll);
        if (Number(insurance2.replace(/,/g, '') || 0) + Number(insurance3.replace(/,/g, '') || 0) > 100000) { setWarning1(true) } else { setWarning1(false) };
        if (Number(insurance5.replace(/,/g, '') || 0) + Number(insurance6.replace(/,/g, '') || 0) + Number(insurance7.replace(/,/g, '') || 0) + Number(insurance9.replace(/,/g, '') || 0) + Number(fund || 0) > 500000) { setWarning2(true) } else { setWarning2(false) };
        setTax(calTax(incomeSum - benefitSum - personal - insurance - charity - fund));
        setIsloading(false)
        setSaved(false)
    }, [fund, incomeObj, personal, insurance, charity, personal1, personal2, personal3, personal4, personal5, personal6, insurance1, insurance2, insurance3, insurance4, insurance5, insurance6, insurance7, insurance8, insurance9, charities]
    );

    // Helper function to create a deep copy of an object
    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }


    async function makeIncomeArr() {
        const sumByType = {};
        let sumOfIncome = 0;
        let sumOfBenefit = 0;

        // Iterate over each object in the array
        await Promise.all(data.map(item => {
            // Iterate over each income object within the item
            item.incomeData.map(incomeItem => {
                if (Object.keys(incomeItem).length > 0) {
                    const { type, subType, amount } = incomeItem;

                    // Increment sumOfIncome
                    sumOfIncome += parseInt(amount);
                    if (subType) {

                        // Initialize nested object for type if not present
                        if (!sumByType[type]) {
                            sumByType[type] = {};
                        }

                        // Initialize nested object for subType if not present
                        if (!sumByType[type][subType]) {
                            sumByType[type][subType] = 0;
                        }

                        // Convert amount to number and add it to the sum corresponding to its type and subType
                        sumByType[type][subType] += parseInt(amount);
                    }
                    else {
                        // Initialize nested object for type if not present
                        if (!sumByType[type]) {
                            sumByType[type] = {};
                        }

                        // Initialize nested object for subType if not present
                        if (!sumByType[type][0]) {
                            sumByType[type][0] = 0;
                        }

                        // Convert amount to number and add it to the sum corresponding to its type and subType
                        sumByType[type][0] += parseInt(amount);
                    }
                }
            });
        }));


        // Create ExpenseBenefit based on sumByType
        const ExpenseBenefit = deepCopy(sumByType);

        // Access and modify properties of ExpenseBenefit only if they exist
        if (sumByType[1] && sumByType[2]) {
            ExpenseBenefit[0] = {};
            ExpenseBenefit[0][0] = Math.min(100000, (ExpenseBenefit[1][0] + ExpenseBenefit[2][0]) * 0.5);
            sumOfBenefit += ExpenseBenefit[0][0];
            delete ExpenseBenefit[1]
            delete ExpenseBenefit[2]
        }
        else if (sumByType[1] || sumByType[2]) {
            if (sumByType[1]) {
                ExpenseBenefit[1][0] = Math.min(100000, ExpenseBenefit[1][0] = ExpenseBenefit[1][0] * 0.5);
                sumOfBenefit += ExpenseBenefit[1][0];
            }
            if (sumByType[2]) {
                ExpenseBenefit[2][0] = Math.min(100000, ExpenseBenefit[2][0] = ExpenseBenefit[2][0] * 0.5);
                sumOfBenefit += ExpenseBenefit[2][0];
            }
        }
        if (sumByType[3]) {
            if (sumByType[3][1]) {
                ExpenseBenefit[3][1] *= 0.5;
                ExpenseBenefit[3][1] = Math.min(100000, ExpenseBenefit[3][1]);
                sumOfBenefit += ExpenseBenefit[3][1];
            }
            if (sumByType[3][2]) {
                delete ExpenseBenefit[3][2]
            }
        }
        if (sumByType[4]) {
            if (sumByType[4][0]) {
                delete ExpenseBenefit[4][0]
            }
        }
        if (sumByType[5]) {
            if (sumByType[5][1]) {
                ExpenseBenefit[5][1] *= 0.3;
                sumOfBenefit += ExpenseBenefit[5][1];
            }
            if (sumByType[5][2]) {
                ExpenseBenefit[5][2] *= 0.2;
                sumOfBenefit += ExpenseBenefit[5][2];
            }
            if (sumByType[5][3]) {
                ExpenseBenefit[5][3] *= 0.15;
                sumOfBenefit += ExpenseBenefit[5][3];
            }
            if (sumByType[5][4]) {
                ExpenseBenefit[5][4] *= 0.3;
                sumOfBenefit += ExpenseBenefit[5][4];
            }
            if (sumByType[5][5]) {
                ExpenseBenefit[5][5] *= 0.1;
                sumOfBenefit += ExpenseBenefit[5][5];
            }
            if (sumByType[5][6]) {
                ExpenseBenefit[5][6] *= 0.2;
                sumOfBenefit += ExpenseBenefit[5][6];
            }
        }
        if (sumByType[6]) {
            if (sumByType[6][1]) {
                ExpenseBenefit[6][1] *= 0.6;
                sumOfBenefit += ExpenseBenefit[6][1];
            }
            if (sumByType[6][2]) {
                ExpenseBenefit[6][2] *= 0.3;
                sumOfBenefit += ExpenseBenefit[6][2];
            }
        }
        if (sumByType[7]) {
            if (sumByType[7][0]) {
                ExpenseBenefit[7][0] *= 0.3;
                sumOfBenefit += ExpenseBenefit[7][0];
            }
        }
        setBenefitObj(ExpenseBenefit);
        setIncomeObj(sumByType);
        setIncomeSum(sumOfIncome);
        setBenefitSum(sumOfBenefit);

        console.log(sumByType, ExpenseBenefit)
    }

    //console.log(benefitObj);
    //console.log(incomeObj);

    // function handleClick() {
    //     if (warning1 == true || warning2 == true || incomeSum - benefitSum - personal - insurance - charity - fund <= 150000) {
    //         alert("เงินได้สุทธิของคุณอยู่ในเกณฑ์ที่ไม่ต้องเสียภาษี")
    //     } else {
    //         navigate('../Goal-Based')
    //     }
    // }

    async function saveTaxGoal() {
        const reductionField = {
            personal1,
            personal2,
            personal3,
            personal4,
            personal5,
            personal6,
            insurance1,
            insurance2,
            insurance3,
            insurance4,
            insurance5,
            insurance6,
            insurance7,
            insurance8,
            insurance9,
            charities
        }
        await axios.post('http://localhost:8000/db/save_reduction_field', {
            userId: uid,
            reductionField,
            totalReduce: totalReduce,
            incomeFourSubtractor: Number(insurance5.replace(/,/g, '') || 0) + Number(insurance6.replace(/,/g, '') || 0) + Number(insurance7.replace(/,/g, '') || 0) + Number(insurance9.replace(/,/g, '') || 0)
        })
        setSaved(true)
        handleOpenSave()
        // await axios.post('http://localhost:8000/db/save_tax_goal', {
        //     Name: 'ลดหย่อนภาษี',
        //     userId: uid,
        //     //netIncome: incomeSum - benefitSum - personal - insurance - charity - fund,
        //     //beforeReduction: incomeSum,
        //     totalReduce: totalReduce,
        //     incomeFourSubtractor: Number(insurance5.replace(/,/g, '') || 0) + Number(insurance6.replace(/,/g, '') || 0) + Number(insurance7.replace(/,/g, '') || 0) + Number(insurance9.replace(/,/g, '') || 0)
        // })
        // navigate("/Goal-Based")
    }

    const [openSave, setOpenSave] = React.useState(false);

    const handleOpenSave = () => setOpenSave(true);
    const handleCloseSave = () => setOpenSave(false);

    const ModalSave = ({ openSave, handleCloseSave }) => {
        return (
            <Modal
                open={openSave}
                onClose={handleCloseSave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 480,
                        backgroundColor: "white",
                        border: "0px solid #000",
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 20,
                        paddingBottom: 20,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" fontWeight={'bold'}>
                        บันทึกข้อมูลสำเร็จ
                    </Typography>
                    <Container
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "80%",
                            marginTop: 12
                        }}
                    >
                        <Button
                            onClick={e => handleCloseSave()}
                            sx={{ backgroundColor: "brown", width: '40%' }}
                            size="md">
                            <Typography
                                color="white"
                                variant="subtitile1"
                            >
                                ปิด
                            </Typography>
                        </Button>
                        <Button
                            onClick={e => { handleCloseSave(); navigate('../Goal-Based'); }}
                            sx={{ backgroundColor: "green", width: '40%', display: 'flex', flexDirection: 'column' }}
                            size="md"
                        >
                            <Typography color="white" variant="subtitile1">
                                ไปหน้า
                            </Typography>
                            <Typography color="white" variant="subtitile1">
                                Goal-Based
                            </Typography>

                        </Button>
                    </Container>
                </Container>
                {/* <OverlayLoading isLoading={isLoading}/> */}
            </Modal>
        );
    };



    if (isEnoughData === true) return (
        <React.Fragment>
            <Navigate />
            {isloading == false && data.length > 0 ?
                (<div style={{ display: 'flex', marginTop: 20, flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
                    <Typography marginBottom={5} marginTop={3} variant="h5" textAlign={"center"} fontWeight={'bold'}>Tax Calculation</Typography>
                    <TableContainer component={Paper} sx={{ width: '50%' }}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#0d5415' }}>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell align="center" style={{ fontWeight: "bold", color: 'white' }}>จำนวนเงิน (บาท)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {/*เงินได้พึงประเมิน*/}
                                <TableRow sx={{ borderBottom: 'unset', width: '100%' }}>
                                    <TableCell style={{ width: '10%' }}>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => setOpen(!open)}
                                        >
                                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                        เงินได้พึงประเมิน
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold", width: "20%" }} align="center">{incomeSum.toLocaleString("en-GB")}</TableCell>
                                </TableRow>
                                <IncomeTable obj={incomeObj} open={open} />

                                {/*ค่าใช้จ่าย*/}
                                <TableRow sx={{ borderBottom: 'unset', width: '100%' }}>
                                    <TableCell style={{ width: '10%' }}>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => setOpen1(!open1)}
                                        >
                                            {open1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                        หักค่าใช้จ่าย
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold", width: "20%" }} align="center">{benefitSum.toLocaleString("en-GB")}</TableCell>
                                </TableRow>
                                <ExpenseBenefitTable obj={benefitObj} open={open1} />

                                {/*ค่าลดหย่อน*/}
                                <TableRow sx={{ borderBottom: 'unset', width: '100%' }}>
                                    <TableCell style={{ width: '10%' }}>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => setOpen2(!open2)}
                                        >
                                            {open2 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                        ค่าลดหย่อน
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold", width: "20%" }} align="center">
                                        {totalReduce.toLocaleString("en-GB")}
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                        <Collapse in={open2} timeout="auto" unmountOnExit>

                                            <Table>
                                                <TableBody>
                                                    {/*ค่าลดหย่อน1*/}
                                                    <TableRow >
                                                        <TableCell style={{ width: "10%" }} >
                                                            <IconButton
                                                                aria-label="expand row"
                                                                size="small"
                                                                onClick={() => setOpen3(!open3)}
                                                            >
                                                                {open3 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                            </IconButton>
                                                        </TableCell>

                                                        <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                            ค่าลดหย่อนภาษีส่วนตัวและครอบครัว
                                                        </TableCell>

                                                        <TableCell align="center" style={{ width: "20%" }} >
                                                            {personal.toLocaleString("en-GB")}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                            <Collapse in={open3} timeout="auto" unmountOnExit>
                                                                <Table>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                ค่าลดหย่อนส่วนตัว
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                60,000
                                                                            </TableCell>                                                                    </TableRow>
                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                ค่าลดหย่อนคู่สมรส
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 60,000' id="standard-basic" label="" variant="standard" value={personal2}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setPersonal2(Number(Math.min(60000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setPersonal2('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                ค่าลดหย่อนฝากครรภ์ และคลอดบุตร
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 60,000' id="standard-basic" label="" variant="standard" value={personal3}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setPersonal3(Number(Math.min(60000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setPersonal3('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                ค่าลดหย่อนภาษีบุตร
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ตามจริง' id="standard-basic" label="" variant="standard" value={personal4}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setPersonal4(Number(e.target.value.replace(/,/g, '')).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setPersonal4('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                ค่าลดหย่อนสำหรับเลี้ยงดูบิดามารดาของตนเองและของคู่สมรส
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 120,000' id="standard-basic" label="" variant="standard" value={personal5}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setPersonal5(Number(Math.min(120000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setPersonal5('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                ค่าลดหย่อนภาษีกรณีอุปการะผู้พิการ หรือบุคคลทุพพลภาพ
                                                                            </TableCell>
                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ตามจริง' id="standard-basic" label="" variant="standard" value={personal6}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setPersonal6(Number(e.target.value.replace(/,/g, '')).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setPersonal6('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/*ค่าลดหย่อน2*/}
                                                    <TableRow >
                                                        <TableCell style={{ width: "10%" }} >
                                                            <IconButton
                                                                aria-label="expand row"
                                                                size="small"
                                                                onClick={() => setOpen4(!open4)}
                                                            >
                                                                {open4 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                            </IconButton>
                                                        </TableCell>

                                                        <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                            ค่าลดหย่อนภาษีกลุ่มประกัน กองทุน และการลงทุน
                                                        </TableCell>

                                                        <TableCell align="center" style={{ width: "20%" }} >
                                                            {insurance.toLocaleString("en-GB")}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                            <Collapse in={open4} timeout="auto" unmountOnExit>
                                                                <Table>
                                                                    <TableBody>
                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                เงินประกันสังคม
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 9,000' id="standard-basic" label="" variant="standard" value={insurance1}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance1(Number(Math.min(9000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance1('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                เงินลงทุนธุรกิจ Social Enterprise (วิสาหกิจเพื่อสังคม)
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 100,000' id="standard-basic" label="" variant="standard" value={insurance8}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance8(Number(Math.min(100000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance8('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="left" style={{ width: "70%" }}>
                                                                                เบี้ยประกันสุขภาพของบิดามารดา
                                                                            </TableCell>

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 15,000' id="standard-basic" label="" variant="standard" value={insurance4}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance4(Number(Math.min(15000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance4('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />
                                                                            {warning1 == true ?
                                                                                <TableCell align="left" style={{ width: "70%", color: 'red' }}>
                                                                                    เบี้ยประกันชีวิต และประกันแบบสะสมทรัพย์ที่มีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                                                </TableCell>
                                                                                :
                                                                                <TableCell align="left" style={{ width: "70%" }}>
                                                                                    เบี้ยประกันชีวิต และประกันแบบสะสมทรัพย์ที่มีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                                                </TableCell>
                                                                            }
                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 100,000' id="standard-basic" label="" variant="standard" value={insurance2}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance2(Number(Math.min(100000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance2('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            {warning1 == true ?
                                                                                <TableCell align="left" style={{ width: "70%", color: 'red' }}>
                                                                                    เบี้ยประกันสุขภาพ และเบี้ยประกันอุบัติเหตุที่คุ้มครองสุขภาพ
                                                                                </TableCell>
                                                                                :
                                                                                <TableCell align="left" style={{ width: "70%" }}>
                                                                                    เบี้ยประกันสุขภาพ และเบี้ยประกันอุบัติเหตุที่คุ้มครองสุขภาพ
                                                                                </TableCell>
                                                                            }

                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 25,000' id="standard-basic" label="" variant="standard" value={insurance3}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance3(Number(Math.min(25000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance3('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        {warning1 == true ? <TableRow  >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="center" style={{ width: "70%", color: 'red' }}>
                                                                                *** กลุ่มค่าลดหย่อนรวมกันไม่เกิน 100,000 บาท ***
                                                                            </TableCell>

                                                                            <TableCell style={{ width: "20%" }} />
                                                                        </TableRow> : null}

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />
                                                                            {warning2 == true ?
                                                                                <TableCell align="left" style={{ width: "70%", color: 'blue' }}>
                                                                                    เบี้ยประกันชีวิตแบบบำนาญที่มีมีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                                                </TableCell>
                                                                                :
                                                                                <TableCell align="left" style={{ width: "70%" }}>
                                                                                    เบี้ยประกันชีวิตแบบบำนาญที่มีมีระยะเวลาคุ้มครอง 10 ปีขึ้นไป
                                                                                </TableCell>
                                                                            }
                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 200,000' id="standard-basic" label="" variant="standard" value={insurance5}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance5(Number(Math.min(200000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance5('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />
                                                                            {warning2 == true ?
                                                                                <TableCell align="left" style={{ width: "70%", color: 'blue' }}>
                                                                                    กองทุนสำรองเลี้ยงชีพ (PVD) / กองทุนสงเคราะห์ครูโรงเรียนเอกชน
                                                                                </TableCell>
                                                                                :
                                                                                <TableCell align="left" style={{ width: "70%" }}>
                                                                                    กองทุนสำรองเลี้ยงชีพ (PVD) / กองทุนสงเคราะห์ครูโรงเรียนเอกชน
                                                                                </TableCell>
                                                                            }
                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 500,000' id="standard-basic" label="" variant="standard" value={insurance6}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance6(Number(Math.min(500000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance6('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />
                                                                            {warning2 == true ?
                                                                                <TableCell align="left" style={{ width: "70%", color: 'blue' }}>
                                                                                    กองทุนบำเหน็จบำนาญราชการ
                                                                                </TableCell>
                                                                                :
                                                                                <TableCell align="left" style={{ width: "70%" }}>
                                                                                    กองทุนบำเหน็จบำนาญราชการ
                                                                                </TableCell>
                                                                            }
                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 500,000' id="standard-basic" label="" variant="standard" value={insurance9}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance9(Number(Math.min(500000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance9('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        <TableRow >
                                                                            <TableCell style={{ width: "10%" }} />
                                                                            {warning2 == true ?
                                                                                <TableCell align="left" style={{ width: "70%", color: 'blue' }}>
                                                                                    กองทุนการออมแห่งชาติ (กอช.)
                                                                                </TableCell>
                                                                                :
                                                                                <TableCell align="left" style={{ width: "70%" }}>
                                                                                    กองทุนการออมแห่งชาติ (กอช.)
                                                                                </TableCell>
                                                                            }
                                                                            <TableCell align="center" style={{ width: "20%" }} >
                                                                                <TextField inputProps={{ style: { textAlign: 'center', fontSize: 14 } }} placeholder='ไม่เกิน 30,000' id="standard-basic" label="" variant="standard" value={insurance7}
                                                                                    onChange={(e) => {
                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                            setInsurance7(Number(Math.min(30000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB"));
                                                                                        }
                                                                                        else if (!e.target.value) {
                                                                                            setInsurance7('')
                                                                                        }
                                                                                    }} />
                                                                            </TableCell>
                                                                        </TableRow>

                                                                        {warning2 == true ? <TableRow  >
                                                                            <TableCell style={{ width: "10%" }} />

                                                                            <TableCell align="center" style={{ width: "70%", color: 'blue' }}>
                                                                                *** กลุ่มค่าลดหย่อน + เงินลงทุนใน RMF และ SSF รวมกันไม่เกิน 500,000 บาท ***
                                                                            </TableCell>

                                                                            <TableCell style={{ width: "20%" }} />
                                                                        </TableRow> : null}
                                                                    </TableBody>
                                                                </Table>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/*ค่าลดหย่อน3*/}
                                                    <TableRow >
                                                        <TableCell style={{ width: "10%" }} >
                                                            <IconButton
                                                                aria-label="expand row"
                                                                size="small"
                                                                onClick={() => setOpen5(!open5)}
                                                            >
                                                                {open5 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                            </IconButton>
                                                        </TableCell>

                                                        <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                                            ค่าลดหย่อนภาษีกลุ่มเงินบริจาค
                                                        </TableCell>

                                                        <TableCell align="center" style={{ width: "20%" }} >
                                                            {charity.toLocaleString("en-GB")}
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                                            <Collapse in={open5} timeout="auto" unmountOnExit>
                                                                <Table>
                                                                    <TableBody>
                                                                        {
                                                                            charities.map((charity, index) => {
                                                                                return (
                                                                                    <TableRow key={index}>
                                                                                        <TableCell style={{ width: "10%" }} />
                                                                                        <TableCell align="left" style={{ width: "70%" }}>
                                                                                            {charity.name}
                                                                                        </TableCell>
                                                                                        <TableCell align="center" style={{ width: "20%" }}>
                                                                                            {charity.name == 'เงินบริจาคให้กับพรรคการเมือง' ?
                                                                                                (<TextField
                                                                                                    inputProps={{ style: { textAlign: 'center', fontSize: 14 } }}
                                                                                                    placeholder='ไม่เกิน 10,000'
                                                                                                    id="standard-basic"
                                                                                                    label=""
                                                                                                    variant="standard"
                                                                                                    value={charity.value}
                                                                                                    onChange={(e) => {
                                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                                            const val = Number(Math.min(10000, parseInt(e.target.value.replace(/,/g, '')))).toLocaleString("en-GB");
                                                                                                            handleCharityChange(index, val)
                                                                                                        }
                                                                                                        else if (!e.target.value) {
                                                                                                            handleCharityChange(index, '')
                                                                                                        }
                                                                                                    }} />)
                                                                                                :
                                                                                                (<TextField
                                                                                                    inputProps={{ style: { textAlign: 'center', fontSize: 14 } }}
                                                                                                    placeholder='ตามจริง'
                                                                                                    id="standard-basic"
                                                                                                    label=""
                                                                                                    variant="standard"
                                                                                                    value={charity.value}
                                                                                                    onChange={(e) => {
                                                                                                        if (e.target.value.match(/^[1-9,][0-9,]{0,7}$/)) {
                                                                                                            const val = Number(e.target.value.replace(/,/g, '')).toLocaleString("en-GB");
                                                                                                            handleCharityChange(index, val)
                                                                                                        }
                                                                                                        else if (!e.target.value) {
                                                                                                            handleCharityChange(index, '')
                                                                                                        }
                                                                                                    }
                                                                                                    }
                                                                                                />)}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )
                                                                            })
                                                                        }
                                                                    </TableBody>
                                                                </Table>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>

                                                </TableBody>
                                            </Table>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>

                                {/*ค่าลดหย่อนจากการลงทุน*/}
                                <TableRow sx={{ borderBottom: 'unset', width: '100%' }}>
                                    <TableCell style={{ width: '10%' }}>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => setOpen6(!open6)}
                                        >
                                            {open6 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="left" style={{ fontWeight: "bold", width: "70%" }}>
                                        ลดภาษีจากการลงทุนในกองทุนรวม
                                    </TableCell>
                                    <TableCell style={{ fontWeight: "bold", width: "20%" }} align="center">{Number(fund || 0).toLocaleString("en-GB")}</TableCell>
                                </TableRow>
                                <UserFundTable open={open6} arr={arr} />

                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* {!(incomeSum - benefitSum - personal - insurance - charity < 0) ? */}
                    <Container style={{ display: 'flex', width: '50%', marginTop: 20, justifyContent: 'space-between' }}>
                        <Typography variant="subtitile1" style={{ fontSize: 17 }}>
                            เงินได้สุทธิ
                        </Typography>
                        <Typography variant="subtitile1" style={{ fontSize: 17 }}>
                            {(incomeSum - benefitSum - personal - insurance - charity - fund) < 0 ? 0 : (incomeSum - benefitSum - personal - insurance - charity - fund).toLocaleString("en-GB")} บาท
                        </Typography>
                    </Container>
                    {/* :
                        <Container style={{ display: 'flex', width: '50%', marginTop: 20, justifyContent: 'space-between' }}>
                            <Typography variant="subtitile1" style={{ fontSize: 17 }}>
                                เงินได้สุทธิ
                            </Typography>
                            <Typography variant="subtitile1" style={{ fontSize: 17, color: 'red' }}>
                                {(incomeSum - benefitSum - personal - insurance - charity - fund).toLocaleString("en-GB")} บาท
                            </Typography>
                        </Container>
                    } */}

                    <Container style={{ display: 'flex', width: '50%', marginTop: 15, justifyContent: 'space-between' }}>
                        <Typography variant="subtitile1" style={{ fontSize: 17 }}>
                            ภาษีที่คุณต้องจ่าย
                        </Typography>
                        <Typography variant="subtitile1" style={{ fontSize: 17 }}>
                            {(tax).toLocaleString("en-GB")} บาท
                        </Typography>
                    </Container>

                    {/*fund !== '' ? null : */
                        (warning1 == true || warning2 == true || incomeSum - benefitSum - personal - insurance - charity - Number(fund || 0) <= 150000) || saved == true ?
                            <Container style={{ display: 'flex', width: '50%', marginTop: 20, marginBottom: 20, justifyContent: 'right', alignItems: 'center' }}>
                                <Tooltip title="Goal-Based Feature !" arrow placement='right'>
                                    <Button disabled={true} style={{ fontWeight: 'normal' }}>บันทึกข้อมูลของคุณ</Button>
                                </Tooltip>
                            </Container>
                            :
                            <Container style={{ display: 'flex', width: '50%', marginTop: 20, marginBottom: 20, justifyContent: 'right', alignItems: 'center' }}>
                                <Tooltip title="Goal-Based Feature !" arrow placement='right'>
                                    <Button onClick={e => saveTaxGoal()} style={{ fontWeight: 'normal' }}>บันทึกข้อมูลของคุณ</Button>
                                </Tooltip>
                            </Container>}
                    <ModalSave
                        openSave={openSave}
                        handleCloseSave={handleCloseSave}
                    />
                </div>) : null
            }

            <Footer />
        </React.Fragment >
    )
    else if (isEnoughData === false) return (
        <React.Fragment>
            <Navigate />
            <div style={{ width: '100vh', height: '100vh' }}>
                <div style={{ display: 'flex', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                    <Box sx={{ display: 'flex', padding: 5, backgroundColor: '#FAFAFA', borderRadius: 5, borderWidth: 1, borderStyle: 'solid', alignItems: 'center', justifyContent: 'center', boxShadow: 6, flexDirection: 'column' }}>
                        <Typography style={{ fontWeight: "bold", fontSize: 22, textAlign: 'center' }}>กรุณากรอกรายได้ของคุณให้ครบทั้งปีเพื่อคำนวนภาษีของคุณ</Typography>
                        <Container style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={() => navigate('/')} sx={{ backgroundColor: '#2E3B55', marginTop: 2 }}>ตกลง</Button>
                        </Container>
                    </Box>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    )
}
