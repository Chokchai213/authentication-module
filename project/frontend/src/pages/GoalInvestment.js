import React, { useEffect, useState } from "react";
import Navigate from "components/Navbar";
import "./NormalGoal.css";
import { useSelector } from "react-redux";
import { CurrentUserRiskProfile } from "components/CurrentUserRiskProfile";
import { InvestmentFundsTable } from "components/InvestmentFundsTable";
import { useParams } from "react-router-dom";
import axios from "axios";
const baseURL = "http://localhost:8000";

async function fetchGoalData(userStore, goalObjId) {
    const result = await axios.get(
        `${baseURL}/db/get_goal_by_obj_id`,
        {
            headers: {
                Authorization: userStore.userToken,
                UserId: userStore.userId,
                GoalObjId: goalObjId
            },
        }
    )
    return result.data
}

async function fetchFundsData(userStore) {
    const result = await  axios.get(
        `${baseURL}/db/funds`,
        {
            headers: {
                Authorization: userStore.userToken,
                UserId: userStore.userId,
            },
        }
    )
    return result.data
}

export const GoalInvestment = () => {
    const userStore = useSelector((state) => state.userStore);
    const { goalObjId } = useParams();
    const [goalData, setGoalData] = useState(null);
    const [fundsData, setFundData] = useState(null);
    useEffect(() => {
        if (goalObjId && userStore.userId !== null) {
            const fetchGoal = async () => {
                return  Promise.all([fetchGoalData(userStore, goalObjId), fetchFundsData(userStore)])
            }
            fetchGoal().then(res => {
                const fetchGoalData = res[0]
                const fetchFundsData = res[1]
                let RMFSSFFunds = fetchFundsData.filter(fund => fund.spec_code.includes("RMF") || fund.spec_code.includes("SSF"));
                let NotRMFSSFFunds = fetchFundsData.filter(fund => !(fund.spec_code.includes("RMF") || fund.spec_code.includes("SSF")));
                setFundData(fetchGoalData.type === "normal" ? NotRMFSSFFunds : RMFSSFFunds)
                setGoalData(fetchGoalData)
            })
        }
    }, [goalObjId, userStore]);


    return (
        <React.Fragment>
            <Navigate />
            {JSON.stringify(goalData)}
            <CurrentUserRiskProfile/>
            <InvestmentFundsTable fundsData={fundsData}/>
            
        </React.Fragment>
    );
}