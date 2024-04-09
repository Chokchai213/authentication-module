import React from "react";
import { Container } from "react-bootstrap";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, CardActions } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatNumberWithCommas } from "utils/numberUtil";
import { OverlayLoading } from "./OverlayLoading";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const themeNormalGoal = createTheme({
    components: {
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 0,
                    paddingLeft: 16,
                    paddingRight: 16
                }
            },
        },
    },
});

const themeReductionGoal = createTheme({
    components: {
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 0,
                    paddingLeft: 12,
                    paddingBottom: 24,
                }
            },
        },
    },
});


function EachCard({ data }) {
    const token = useSelector((state) => state.userStore.userToken);
    const navigate = useNavigate();

    const [openDelete, setOpenDelete] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    const handleClickEdit = (data) => {
        navigate("/Goal-Based/edit-goal/" + data._id)
    }

    const handleClickInvest = (data) => {
        navigate("/Goal-Based/invest-goal/" + data._id)

    }

    const ModalDelete = ({ openDelete, handleCloseDelete }) => {
        function handleDeleteGoal() {
            console.log('CLICKED')
            setIsLoading(true);
            handleCloseDelete();
            axios.post(
                `http://localhost:8000/db/delete_goal`,
                {
                    Name: data.Name,
                    goalId: data._id,
                },
                {
                    headers: {
                        Authorization: token,
                        UserId: data.userId,
                    },
                }
            ).then((res) => {
                setIsLoading(false);
                window.location.reload(false);
            }).catch((err) => {
                console.log('err :: ', err);
                setIsLoading(false);
            })
        }
        return (
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
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
                    <Typography id="modal-modal-title" variant="subtitile1">
                        ยืนยันการลบเป้าหมาย
                    </Typography>
                    <Typography gutterBottom id="modal-modal-description" variant="h6">
                        {data.Name || ""}
                    </Typography>
                    <Container
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "50%",
                        }}
                    >
                        <Button sx={{ backgroundColor: "green" }} size="small">
                            <Typography
                                onClick={handleDeleteGoal}
                                color="white"
                                variant="subtitile1"
                            >
                                ตกลง
                            </Typography>
                        </Button>
                        <Button
                            onClick={handleCloseDelete}
                            sx={{ backgroundColor: "brown" }}
                            size="small"
                        >
                            <Typography color="white" variant="subtitile1">
                                ยกเลิก
                            </Typography>
                        </Button>
                    </Container>
                </Container>
                {/* <OverlayLoading isLoading={isLoading}/> */}
            </Modal>
        );
    };

    if (data.Name !== "ลดหย่อนภาษี") {
        return (
            <Card
                sx={{
                    minHeight: 300,
                    minWidth: 325,
                    paddingTop: 1,
                    paddingBottom: 1,
                    margin: 1,
                }}
            >
                <CardMedia
                    component="img"
                    sx={{
                        height: 140,
                        objectFit: "contain",
                        padding: 1.4,

                    }}
                    image={require("../invest.png")}
                //alt="icon/image"
                />
                <ThemeProvider
                    theme={themeNormalGoal}>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            ชื่อ : {data.Name || ""}
                        </Typography>
                        <Typography
                            component="div"
                            variant="subtitile1"
                            color="text.secondary"
                        >
                            ระยะเวลาการลงทุน : {parseInt(new Date(data.GoalTime).getFullYear()) - parseInt(new Date(data.CreatedDate).getFullYear()) + " ปี" || ""}
                        </Typography>
                        <Typography
                            component="div"
                            variant="subtitile1"
                            color="text.secondary"
                        >
                            เป้าหมาย : {formatNumberWithCommas(data.Goal) + " บาท" || ""}
                        </Typography>
                        <Typography
                            component="div"
                            variant="subtitile1"
                            color="text.secondary"
                        >
                            สถานะ : <span style={{ color: data.hasOwnProperty("goalStatus") ? data.goalStatus ? "green" : "red" : null }}>{data.hasOwnProperty("goalStatus") ? data.goalStatus ? "สำเร็จ" : "ยังไม่บรรลุเป้าหมาย" : "-"}</span>
                        </Typography>
                        <Typography
                            component="div"
                            variant="subtitile1"
                            color="text.secondary"
                        >
                            วันที่สร้าง :{" "}
                            {new Date(data.CreatedDate).toLocaleDateString("th-TH", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }) || ""}
                        </Typography>
                    </CardContent>
                </ThemeProvider>
                <CardActions
                    style={{ width: "100%", justifyContent: "center", gap: "10%" }}
                >
                    <Button
                        onClick={() => {
                            handleClickEdit(data)
                        }}
                        sx={{ backgroundColor: "#4A90E2" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            แก้ไข
                        </Typography>
                    </Button>
                    <Button
                        onClick={() => {
                            handleClickInvest(data)
                        }}
                        sx={{ backgroundColor: "#2ECC71" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            ลงทุน
                        </Typography>
                    </Button>
                    <Button
                        onClick={handleOpenDelete}
                        sx={{ backgroundColor: "#E74C3C" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            ลบ/ขาย
                        </Typography>
                    </Button>
                    <ModalDelete
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                    />
                </CardActions>
                <OverlayLoading isLoading={isLoading} />
            </Card>
        );
    } else {
        return (
            <Card
                sx={{
                    minHeight: 300,
                    minWidth: 325,
                    paddingTop: 1,
                    paddingBottom: 1,
                    margin: 1,
                }}
            >
                <CardMedia
                    component="img"
                    sx={{ height: 140, objectFit: "contain", padding: 1.6 }}
                    image={require("../tax.png")}
                    alt="icon/image"
                />
                <ThemeProvider theme={themeReductionGoal}>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            ชื่อ : {data.Name || ""}
                        </Typography>
                        <Typography
                            component="div"
                            variant="subtitile1"
                            color="text.secondary"
                        >
                            ระยะเวลาการลงทุน : -
                        </Typography>
                        <Typography
                            component="div"
                            variant="subtitile1"
                            color="text.secondary"
                        >
                            เป้าหมาย : ลดหย่อนภาษีให้ได้มากที่สุด
                        </Typography>
                        <Typography
                            component="div"
                            variant="subtitile1"
                            color="text.secondary"
                        >
                            วันที่สร้าง :{" "}
                            {new Date(data.CreatedDate).toLocaleDateString("th-TH", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }) || ""}
                        </Typography>
                    </CardContent>
                </ThemeProvider>

                <CardActions
                    style={{ width: "100%", justifyContent: "center", gap: "10%" }}
                >

                    <Button
                        onClick={() => {
                            handleClickInvest(data)
                        }}
                        sx={{ backgroundColor: "#2ECC71" }}
                        size="small"
                    >

                        <Typography color="white" variant="subtitile1">
                            ลงทุน
                        </Typography>
                    </Button>
                    <Button
                        onClick={handleOpenDelete}
                        sx={{ backgroundColor: "#E74C3C" }}
                        size="small"
                    >
                        <Typography color="white" variant="subtitile1">
                            ลบ/ขาย
                        </Typography>
                    </Button>
                    <ModalDelete
                        openDelete={openDelete}
                        handleCloseDelete={handleCloseDelete}
                    />
                </CardActions>
                <OverlayLoading isLoading={isLoading} />
            </Card>
        );
    }
}

export default function GoalCard({ Goal }) {
    if (Object.keys(Goal).length > 0) {
        return Goal.map((card) => <EachCard key={card.Name} data={card} />);
    }
}
