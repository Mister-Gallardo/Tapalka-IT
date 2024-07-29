import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./styles/styles.scss";

interface IPosition {
  x: number;
  y: number;
}

function App() {
  const [count, setCount] = useState(0);
  const [tapPosition, setTapPosition] = useState<IPosition | null>(null);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = (event: React.TouchEvent) => {
    const touchCount = event.touches ? event.touches.length : 1;
    setCount((prev) => prev + touchCount);
    setTapCount(touchCount);
    setTapPosition({
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    });
    console.log(event)
  }

  useEffect(() => {
    const id = setTimeout(() => {
      setTapCount(0);
    }, 1000);

    return () => {
      clearTimeout(id);
    }
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
          // onTouchStart={handleTap}
          disableRipple
          sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}
        >
          <img onTouchStart={handleTap} src="images/fruit.png" className="fruit-image"></img>
          {tapCount > 0 && tapPosition && (
            <Box
              className="tap-message"
              style={{ position: 'absolute', left: tapPosition.x, top: tapPosition.y }}
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
        <Box></Box>
      </Box>
    </Box>
  );
}

export default App;
