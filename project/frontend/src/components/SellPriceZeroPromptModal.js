import React, { useEffect, useState, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export const SellPriceZeroPromptModal = ({open, fundData}) => {
    console.log('fundData :: ',fundData)
    const navigate = useNavigate();
    return ( <>
        <Modal
            show={open}
            backdrop="static"
            className="warning-zero-modal"
            style={{
                top: "80%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <Modal.Header>
                    <Typography
                        variant="h5"
                        style={{
                            color: "#fe0000",
                            textDecoration: "underline",
                            textDecorationColor: "transparent",
                            display: "inline-block",
                            width: "100%",
                            userSelect: "none",
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                    >
                        ไม่สามารถทำรายการได้ !
                    </Typography>
            </Modal.Header>
            <Modal.Body>
            <Typography
                        variant="h12"
                        style={{
                            userSelect: "none",
                            textAlign: "center"
                        }}
                    >                
                        ขณะนี้ราคาขายของกองทุน <span style={{fontWeight : "bold"}}>{fundData && fundData.proj_name_th}</span> เท่ากับ 0 จึงไม่สามารถทำรายการได้
                    </Typography>
            </Modal.Body>
            <Modal.Footer>
            <Container style={{ textAlign: "center" }}>
                        <Button
                            variant="danger"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            กลับ
                        </Button>
                    </Container>
            </Modal.Footer>
        </Modal>
    </>)
}