import { ComponentLoading } from "./OverlayLoading"
import { calTax } from "pages/TaxCalculation";
import Box from "@mui/material/Box";
import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { useSelector } from 'react-redux'

export const ReductionGoalBuyInformation = ({ goalData }) => {

    const [benefitObj, setBenefitObj] = React.useState(0);
    const [incomeObj, setIncomeObj] = React.useState(0);
    const [incomeSum, setIncomeSum] = React.useState(0);
    const [benefitSum, setBenefitSum] = React.useState(0);
    //console.log(benefitObj, benefitSum, incomeObj, incomeSum)

    console.log('goalData :: ', goalData)

    const [netIncome, setNetIncome] = React.useState(0);
    const [tax, setTax] = React.useState('');
    const [recommend, setRecommend] = React.useState(0)
    const [seperate, setSeperate] = React.useState(false);
    const [isloading, setIsloading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [sumAsset, setSumAsset] = React.useState(0);

    const userStore = useSelector((state) => state.userStore);

    React.useEffect(() => {
        async function fetchData() {
            if (goalData !== null && data.length === 0) {
                await axios
                    .get(`http://localhost:8000/db/userdata=${goalData.userId}`)
                    .then((response) => {
                        setData(response.data);
                    });
            }
        };
        async function fetchGoalAsset() {
            try {
                const res = await axios.get(`http://localhost:8000/db/get_user_asset_by_goal_id`, {
                    headers: {
                        userId: userStore.userId,
                        Authorization: userStore.userToken,
                        goalObjId: goalData._id,
                    },
                });
                const sumAsset = res.data.reduce((acc, eachAsset) => acc + Number(eachAsset.Funds[0].amount || 0), 0)
                setSumAsset(sumAsset);
            } catch (err) {
                console.log("err :: ", err);
            }
        };
        if (goalData) {
            setIsloading(true)
            fetchData();
            fetchGoalAsset();
            makeIncomeArr();
            setTax(calTax(netIncome));
            const calRec = Math.min(500000 - goalData.incomeFourSubtractor, (netIncome + sumAsset) - 150000);
            console.log("netIncome + sumAsset :: ", netIncome + sumAsset)
            setRecommend(calRec)
            const isEqual = (incomeSum * 0.3) - goalData.incomeFourSubtractor;
            if (isEqual < 200000 - goalData.incomeFourSubtractor) {
                setSeperate(false)
            }
            else {
                setSeperate(true)
            }
            setIsloading(false)
        }
    }, [goalData, data, tax])

    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    async function makeIncomeArr() {
        const sumByType = {};
        let sumOfIncome = 0;
        let sumOfBenefit = 0;

        await Promise.all(data.map(item => {
            item.incomeData.map(incomeItem => {
                if (Object.keys(incomeItem).length > 0) {
                    const { type, subType, amount } = incomeItem;

                    sumOfIncome += parseInt(amount);
                    if (subType) {

                        if (!sumByType[type]) {
                            sumByType[type] = {};
                        }

                        if (!sumByType[type][subType]) {
                            sumByType[type][subType] = 0;
                        }

                        sumByType[type][subType] += parseInt(amount);
                    }
                    else {

                        if (!sumByType[type]) {
                            sumByType[type] = {};
                        }
                        if (!sumByType[type][0]) {
                            sumByType[type][0] = 0;
                        }

                        sumByType[type][0] += parseInt(amount);
                    }
                }
            });
        }));

        const ExpenseBenefit = deepCopy(sumByType);

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
        setNetIncome(sumOfIncome - sumOfBenefit - goalData.totalReduce - sumAsset)
    }



    return (
        <React.Fragment>
            {goalData === null || isloading ? <ComponentLoading isLoading={isloading} size={400} />
                :
                <Container
                    sx={{
                        marginTop: 5,
                        marginBottom: 5,
                        display: "ruby-text",
                    }}
                >
                    <Box sx={{
                        minWidth: "90%",
                        minHeight: "90%",
                        maxWidth: "90%",
                        maxHeight: "90%",
                        borderRadius: 6,
                        boxShadow: 6,
                        padding: 4,
                        position: "relative",
                        overflow: "auto",
                        justifyContent: "center",
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h5" gutterBottom>การคำนวนภาษีจากรายได้และการลงทุนในปีนี้</Typography>
                        <Typography fontSize={20}>ภาษีที่คุณต้องจ่าย : {Math.max(0, tax).toLocaleString("en-GB", { maximumFractionDigits: 2 })} บาท</Typography>
                        <Typography fontSize={20}>เงินที่แนะนำให้ซื้อกองทุน : {Math.max(0, recommend).toLocaleString("en-GB", { maximumFractionDigits: 2 })} บาท</Typography>
                        <Typography fontSize={20}>ปัจจุบันคุณซื้อกองทุนไปแล้ว : {Math.max(0, sumAsset).toLocaleString("en-GB", { maximumFractionDigits: 2 })} บาท</Typography>
                        {seperate === true ?
                            <>
                                <Typography fontSize={20}>
                                    เพดานในการซื้อกองทุน RMF สูงสุดของคุณคือ : {Math.max(0, Math.min(500000 - goalData.incomeFourSubtractor, (incomeSum * 0.3) - goalData.incomeFourSubtractor)).toLocaleString("en-GB")} บาท {/*เพิ่ม min 500,000 - กลุ่มค่าลดหย่อน 4 ตัว*/}
                                </Typography>
                                <Typography fontSize={20}>
                                    เพดานในการซื้อกองทุน SSF สูงสุดของคุณคือ : {Math.max(0, Math.min(200000 - goalData.incomeFourSubtractor, (incomeSum * 0.3) - goalData.incomeFourSubtractor)).toLocaleString("en-GB")} บาท
                                </Typography>
                            </>
                            :
                            <Typography fontSize={20}>
                                เพดานในการซื้อกองทุน RMF และ SSF สูงสุดของคุณคือ : {Math.max(0, (incomeSum * 0.3) - goalData.incomeFourSubtractor).toLocaleString("en-GB")} บาท {/*เพิ่ม min 500,000 - กลุ่มค่าลดหย่อน 4 ตัว*/}
                            </Typography>}
                    </Box>
                </Container>}
        </React.Fragment>
    )
}