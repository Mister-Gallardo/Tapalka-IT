import { useState } from "react";
import { Box, Typography } from "@mui/material";
import "./styles/styles.scss";

function App() {
  const [count, setCount] = useState(0);
  // const [tapPosition, setTapPosition] = useState(null);
  // const [tapCount, setTapCount] = useState(0);

  // const handleTap = (event: React.TouchEvent) => {
  //   const touchCount = event.touches.length;
  //   setCount(count + touchCount);
  //   setTapCount(touchCount);
  //   setTapPosition({
  //     x: event.touches[0].clientX,
  //     y: event.touches[0].clientY,
  //   });

    // Скрыть сообщение через 1 секунду
  //   setTimeout(() => {
  //     setTapCount(0);
  //   }, 1000);
  // };

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
        <Box className="score" onTouchStart={(e) => {}}>
          <img src="public/images/score_coin.png" width="30px"></img>
          <Typography>{count}</Typography>
        </Box>
        <Box sx={{ display: {xs: "flex", md: 'none'}, justifyContent: "center" }}>
          <img src="public/images/fruit.png" style={{minWidth: '300px', maxWidth: '400px', width: '85vw'}}></img>
        </Box>
        <Typography sx={{display: {xs: "none", md: 'block'}, fontSize: '38px', fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: '45px'}}>Продолжите на мобильном устройстве</Typography>
        <Box></Box>
      </Box>
    </Box>
  );
}

export default App;
