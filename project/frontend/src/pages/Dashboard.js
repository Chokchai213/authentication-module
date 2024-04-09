import React, { useEffect, useState } from "react";
import Navigate from "components/Navbar";
import MonthDataTable from "components/DataTable_Dashboard";
import PieChartComponent from "components/PieChart_Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { LoginWithLocalData } from "../store/UserSlice";
import axios from "axios";
import { Container } from "react-bootstrap";
import { UserNetSummary } from "components/UserNetSummary";
import { Footer } from "components/Footer";
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

export const Dashboard = () => {
    const userStore = useSelector((state) => state.userStore);
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        Promise.all([fetchUserData(userStore)]).then((res) => {
            const data = res[0];
            if (data.length > 0) {
                const groupedData = groupDataByYear(data);
                const yearInData = groupedData.map((data) => data.year);
                if (yearInData.length > 0) {
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
                }
                setUserData(groupedData);
            } else {
                const currentDate = new Date();
                const currentYearObj = {
                    data: [],
                    year: currentDate.getFullYear().toString(),
                };
                setUserData([currentYearObj]);
            }
        });
    }, [userStore]);

    try {
        if (userStore.userId === null) {
            const localUser = localStorage.getItem("userData");
            if (localUser) {
                axios
                    .post(`${baseURL}/auth/veriylocaluser`, {
                        localUser: localUser,
                    })
                    .then((res) => {
                        dispatch(LoginWithLocalData(JSON.parse(localUser)));
                    })
                    .catch((e) => {
                        localStorage.removeItem("userData");
                        console.log(e);
                    });
            }
        }
    } catch (e) {
        console.log(e);
    }
    return (
        <React.Fragment>
            <Navigate />
            <Container>
                    {/* <UserNetSummary userData={userData} /> */}
                    <br/>
                    <MonthDataTable userData={userData} setUserData={setUserData} />
                    <PieChartComponent userData={userData} />
            </Container>
            <Footer/>
        </React.Fragment>
    );
};
