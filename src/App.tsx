import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./styles/styles.scss";
import ProgressBar from "./components/ProgressBar";

interface IPosition {
  x: number;
  y: number;
}

function App() {
  const [count, setCount] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const [isActive, setIsActive] = useState(false);
  const [tapPosition, setTapPosition] = useState<IPosition | null>(null);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = (event: React.TouchEvent) => {
    if (!energy) return null;

    setIsActive(true);
    setTimeout(() => {
      setIsActive(false);
    }, 100);

    const touchCount = event.touches ? event.touches.length : 1;
    setCount((prev) => prev + touchCount);
    setEnergy((prev) => prev - touchCount);
    setTapCount(touchCount);
    setTapPosition({
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    });
  };

  function foo() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  useEffect(() => {
    const idTap = setTimeout(() => {
      setTapCount(0);
    }, 1000);

    const idEnergy = setInterval(() => {
      setEnergy((prev) => (prev < 1000 ? prev + 1 : prev));
    }, 1000);

    return () => {
      clearTimeout(idTap);
      clearInterval(idEnergy);
    };
  }, [count]);

  return (
    <Box className="main">
      <Box
        sx={{
          display: "flex",
          gap: "25px",
          flexDirection: "column",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <Box component="div" className="score">
          <img src="images/score_coin.png" width="30px"></img>
          <Typography>{count}</Typography>
        </Box>
        <Button
          className="tap-counter"
          onClick={foo}
          disableRipple
          sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}
        >
          <img
            onTouchStart={handleTap}
            src="images/fruit.png"
            className={isActive ? "fruit_scale fruit-image" : "fruit-image"}
          ></img>
          {tapCount > 0 && tapPosition && (
            <Box
              className="tap-message"
              style={{
                position: "absolute",
                left: tapPosition.x,
                top: tapPosition.y,
              }}
            >
              +{tapCount}
            </Box>
          )}
        </Button>
        <Typography
          sx={{
            display: { xs: "none", md: "block" },
            fontSize: "38px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginTop: "45px",
          }}
        >
          Продолжите на мобильном устройстве
        </Typography>
        <Box
          sx={{
            mt: "40px",
            mb: '20px',
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            width: "40%",
          }}
        >
          <Typography
            sx={{ color: "white", fontSize: "13px", fontWeight: "550" }}
          >
            Your Energy: {Math.floor((energy / 1000) * 100)}%
          </Typography>
          <ProgressBar energy={energy} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
