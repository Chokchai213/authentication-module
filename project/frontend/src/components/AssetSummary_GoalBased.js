import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSelector } from "react-redux";
import { AssetSummaryGoalTable } from "./AssetSummaryGoalTable_GoalBased";
import { AssetSummaryGoalPieChart } from "./AssetSummaryGoalPieChart_GoalBased";
import axios from "axios";

const baseURL = "http://localhost:8000";

async function getUserAssets(userStore) {
    const getResult = await axios.get(`${baseURL}/db/get_user_asset`, {
        headers: {
            Authorization: userStore.userToken,
            userId: userStore.userId,
        },
    });
    return getResult.data.queryResult;
}

async function getUserGoal(userStore) {
    const getResult = await axios.get(`${baseURL}/db/get_user_goal`, {
        headers: {
            Authorization: userStore.userToken,
            userId: userStore.userId,
        },
    });
    return getResult.data.queryResult;
}

function combineGoalAndAsset(assetData, goalData) {
    assetData.forEach((asset, index) => {
        const depositAssets = asset.Funds.filter(
            (deposit) => deposit.assetType === "deposit"
        );
        const newAssets = asset.Funds.filter(
            (deposit) => deposit.assetType !== "deposit"
        );
        const sortedAssets = newAssets.concat(depositAssets);
        assetData[index].Funds = sortedAssets;
    });
    goalData.forEach((goal, index) => {
        const thisGoalAssets = assetData.filter(
            (asset) => asset.goalObjId === goal._id
        );
        goalData[index].assets = thisGoalAssets;
    });
    return goalData;
}

export const AssetSummary = () => {
    const userStore = useSelector((state) => state.userStore);
    const [userData, setUserData] = useState(null);
    const [selectGoalValue, setSelectGoalValue] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    const [assetData, setAssetData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const assetData = await getUserAssets(userStore);
                const goalData = await getUserGoal(userStore);
                const userData = combineGoalAndAsset(assetData, goalData);
                if (userData.length > 0) {
                    setSelectGoalValue(userData[0].Name);
                }
                setAssetData(assetData);
                setUserData(userData);
            } catch (error) {
                console.error("Error fetching user assets:", error);
            }
        };
        fetchData();
    }, [userStore]);

    useEffect(() => {
        if (userData) {
            setSelectedData(userData.find((data) => data.Name === selectGoalValue));
        }
    }, [selectGoalValue, userData]);
    return (
        <Container
            sx={{
                marginTop: 5,
                minHeight: "100vh",
                display: "ruby-text",
            }}
        >
            <Box
                sx={{
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
                }}
            >
                <AssetSummaryGoalPieChart
                    assetData={assetData}
                ></AssetSummaryGoalPieChart>
            </Box>
            <Box
                sx={{
                    marginTop: "5vh",
                    minWidth: "90%",
                    minHeight: "90%",
                    maxWidth: "90%",
                    maxHeight: "90%",
                    borderRadius: 6,
                    boxShadow: 6,
                    padding: 4,
                    position: "relative",
                    overflow: "auto",
                    marginBottom: "5vh",
                }}
            >
                {userData && (
                    <Box
                        sx={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FormControl
                            sx={{
                                minWidth: "20%",
                                // position: "absolute",
                                // right : "0"
                                // right: "5.5%",
                                // top: "3%",
                            }}
                        >
                            <InputLabel id="select-goal-label">เป้าหมาย</InputLabel>
                            <Select
                                labelId="select-goal"
                                id="select-goal"
                                value={selectGoalValue}
                                label="Goals"
                                onChange={(e) => {
                                    setSelectGoalValue(e.target.value);
                                }}

                                disabled={userData.length > 0 ? false : true}
                            >
                                {userData.map((data, index) => (
                                    <MenuItem
                                        key={data._id + "-select-item-" + index}
                                        value={data.Name}
                                    >
                                        {data.Name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
                <AssetSummaryGoalTable
                    selectedData={selectedData}
                ></AssetSummaryGoalTable>
            </Box>
        </Container>
    );
};
