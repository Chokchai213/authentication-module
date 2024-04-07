import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

export function OverlayLoading({ isLoading }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(isLoading);
    }, [isLoading]);

    return (
        <div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export function ComponentLoading({ isLoading, size }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(!isLoading);
    }, [isLoading]);
    return (
        <Container style={{ display: open ? "none" : "flex", }}
            sx={
                {
                    alignItems: "center",
                    justifyContent : "center",
                    height : size,
                    width : size
            }
            }
        >
            <CircularProgress color="inherit" />
        </Container>
    );
}
