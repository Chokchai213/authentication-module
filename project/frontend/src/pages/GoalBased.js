import React, { useState } from "react";
import Navigate from "components/Navbar";
import { Container } from "react-bootstrap";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, CardActions, TextField } from "@mui/material";
import GoalCard from "components/GoalCard";
//import mockGoal from "mockupData/mockGoal.json"
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { AssetSummary } from "components/AssetSummary_GoalBased";
import CircularProgress from '@mui/joy/CircularProgress';
import { RiskProfilePromptModal } from "components/RiskProfilePromptModal_GoalBased";
import { CurrentUserRiskProfile } from "components/CurrentUserRiskProfile";
import { UserNetSummary } from "components/UserNetSummary";
import Box from "@mui/material/Box";
import { Footer } from "components/Footer";
const baseURL = "http://localhost:8000";

export const GoalBased = () => {
    const navigate = useNavigate();

    const uid = useSelector((state) => state.userStore.userId);
    const token = useSelector((state) => state.userStore.userToken);
    const [data, setData] = React.useState([]);
    const [goal, setGoal] = React.useState([]);
    const [isloading, setIsloading] = React.useState(true);
    const [needAllocate, setNeedAllocate] = React.useState(false)

    const [riskProfile, setRiskProfile] = React.useState();

    const [isOpenRiskProfilePrompModal, setIsOpenRiskProfilePrompModal] = useState(false);
    React.useEffect(() => {
        async function fetchData() {
            if (uid != null) {
                let riskProfileTemp;
                await axios
                    .get(`http://localhost:8000/db/userdata=${uid}`)
                    .then((response) => {
                        setData(response.data);
                    });
                await axios
                    .get(`http://localhost:8000/db/usergoal=${uid}`)
                    .then((res) => {
                        setGoal(res.data);
                    });
                setIsloading(false);
            }
        }
        fetchData();
    }, [uid]);
    React.useEffect(() => {
        async function fetchData() {
            if (uid != null) {
                await axios
                    .get(`http://localhost:8000/db/userdata=${uid}`)
                    .then((response) => {
                        setData(response.data);
                    });
                await axios
                    .get(`http://localhost:8000/db/usergoal=${uid}`)
                    .then((res) => {
                        setGoal(res.data);
                        if (res.data.length > 0) {
                            const sumPercent =
                                res.data.reduce(
                                    (acc, current) => acc + Number(current.Percentage || 0),
                                    0
                                );
                            if (sumPercent !== 100) {
                                setNeedAllocate(true)
                            } else {
                                setNeedAllocate(false)
                            }
                        }
                    });
                setIsloading(false);
                // console.log(needAllocate)
                // if (needAllocate === true) { handleOpenEditGoal() }
            }
        }
        fetchData();
    }, [uid, needAllocate]);



    function handleGoalTypeClick(type) {
        console.log('handleGoalTypeClick')
        if (type === "normal") {
            navigate("./normal-goal");
        } else if (type === "tax") {
            navigate("./reduce-tax-goal", {
                state: { data: data },
            });
        }
    }

    async function handleCreateGoal() {
        const getResult = await axios.get(`${baseURL}/db/get_user_risk_profile`, {
            headers: {
                Authorization: token,
                userId: uid,
            },
        });
        try {
            if (getResult.data.findResult !== null) {
                if (goal.length > 0) {
                    const found = goal.some((obj) => obj.Name === "ลดหย่อนภาษี");
                    if (found) {
                        //handleOpenNewGoal();
                        navigate('./normal-goal')
                    } else {
                        handleOpenCreate();
                    }
                } else {
                    handleOpenCreate();
                }
            } else {
                setIsOpenRiskProfilePrompModal(true);
            }
        } catch (err) {
            console.log('err :: ', err)
        }
    }

    const [openCreate, setOpenCreate] = React.useState(false);
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => {
        setOpenCreate(false);
    };
    const ModalCreate = ({ openCreate, handleCloseCreate }) => {
        return (
            <Modal
                open={openCreate}
                onClose={handleCloseCreate}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Container
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        backgroundColor: "white",
                        border: "0px solid #000",
                        borderRadius: 7,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 12,
                        paddingBottom: 12,
                    }}
                >
                    <Typography gutterBottom id="modal-modal-title" variant="h6">
                        สร้างเป้าหมาย
                    </Typography>
                    <Container
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            onClick={(e) => handleGoalTypeClick("normal")}
                            sx={{ backgroundColor: "black", marginRight: 4 }}
                            size="medium"
                        >
                            <Typography color="white" variant="subtitile1">
                                เพื่อเก็บออมเงิน
                            </Typography>
                        </Button>
                        <Button
                            onClick={(e) => handleGoalTypeClick("tax")}
                            sx={{ backgroundColor: "black" }}
                            size="meduim"
                        >
                            <Typography color="white" variant="subtitile1">
                                เพื่อลดหย่อนภาษี
                            </Typography>
                        </Button>
                    </Container>
                </Container>
            </Modal>
        );
    };

    return (
        <React.Fragment>
            <Navigate />
            <Typography marginBottom={5} marginTop={5} variant="h5" textAlign={"center"} fontWeight={'bold'}>Goal-Based Investment</Typography>
            <CurrentUserRiskProfile></CurrentUserRiskProfile>
            {/* Contained in Box */}
            <Container
                sx={{
                    display: "ruby-text",
                }}
            >
                <Box
                    sx={{
                        marginTop: 10,
                        marginBottom: 10,
                        borderRadius: 6,
                        boxShadow: 6,
                        padding: 4,
                    }}
                >
                    <UserNetSummary />
                </Box>
            </Container>

            <Container
                style={{
                    display: "flex",
                    marginTop: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    width: "70%",
                    maxHeight: 400,
                    overflow: "auto",
                    backgroundColor: "#F0F0F0",
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    borderTopLeftRadius: 10
                }}
            >
                <GoalCard Goal={goal} />
                <Card
                    sx={{
                        minHeight: 300,
                        minWidth: 300,
                        paddingTop: 1,
                        paddingBottom: 1,
                        margin: 1,
                    }}
                >
                    <CardActions
                        sx={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {isloading === false ? <Button
                            onClick={handleCreateGoal}
                            sx={{ backgroundColor: "black" }}
                            size="large"
                        >
                            <Typography color="white" variant="subtitile1">
                                สร้างเป้าหมาย
                            </Typography>
                        </Button>
                            :
                            <CircularProgress
                                color="neutral"
                                value={35}
                                variant="plain"
                            />}
                        <ModalCreate
                            openCreate={openCreate}
                            handleCloseCreate={handleCloseCreate}
                        />
                        {/* <ModalNewGoal open={openNewGoal} close={handleCloseNewGoal} /> */}
                        <RiskProfilePromptModal isOpen={isOpenRiskProfilePrompModal} setIsOpen={setIsOpenRiskProfilePrompModal}></RiskProfilePromptModal>
                    </CardActions>
                </Card>
            </Container>
            <AssetSummary></AssetSummary>
            <Footer />
        </React.Fragment>
    );
};
