import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ProgressBar from "../components/ProgressBar";
import { IPosition } from "../services/interfaces";
import Debounce from "../heplers/Debounce";
import SetFullScreen from "../heplers/SetFullScreen";
import MobileErr from "../components/MobileErr";

function Tapalka() {
  const [count, setCount] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [isPressed, setIsPressed] = useState(false);
  const [tapPosition, setTapPosition] = useState<IPosition | null>(null);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = (event: React.TouchEvent, energyCount: number) => {
    if (!energyCount) return;

    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 100);

    const eventTouch = event.touches.length < 4 ? event.touches.length : 3;
    const touchCount = eventTouch
      ? energyCount - eventTouch >= 0
        ? eventTouch
        : energyCount
      : 1;

    setCount((prev) => prev + touchCount);
    setEnergy((prev) => (prev - touchCount >= 0 ? prev - touchCount : 0));
    setTapCount(touchCount);
    setTapPosition({
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    });
  };

  // Функция debounce нам нужна, потому что onTouchStart
  // отрабатывает немного не так, как нам нужно:
  // например, при прикосновении трёх пальцев
  // метод onTouchStart вызовется три раза:
  // для нажатия одного пальца, двух и, наконец, трёх.
  // Данная система ломает логику нашего приложения.
  // Из-за этого я создал функци debounce,
  // которая будет оставлять выполнение только
  // последнего вызова метода onTouchStart

  // P.S. тут я специально использовал useState,
  // в который передал колбэк функцию,
  // чтобы не производить ненужных рендеров этой переменной
  const [debouncedFunc] = useState(() => Debounce(handleTap, 100));

  useEffect(() => {
    const idTap = setTimeout(() => {
      setTapCount(0);
    }, 1000);

    return () => {
      clearTimeout(idTap);
    };
  }, [tapPosition]);

  useEffect(() => {
    const idAuto = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    const idEnergy = setInterval(() => {
      setEnergy((prev) => (prev < 100 ? prev + 1 : prev));
    }, 1000);

    return () => {
      clearInterval(idEnergy);
      clearInterval(idAuto);
    };
  }, []);

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
        <Box
          component="div"
          className="score"
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <img src="images/score_coin.png" width="30px"></img>
          <Typography>{count}</Typography>
        </Box>
        <Button
          className="tap-counter"
          onClick={SetFullScreen}
          disableRipple
          sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}
        >
          <img
            onTouchStart={(e) => {
              debouncedFunc(e, energy);
            }}
            src="images/fruit.png"
            className={isPressed ? "fruit_scale fruit-image" : "fruit-image"}
          ></img>
          {tapCount > 0 && tapPosition && (
            <Typography
              className="tap-message"
              style={{
                position: "absolute",
                left: tapPosition.x,
                // отображаем немного повыше нажатия
                // чтоб было видно на экране
                top: tapPosition.y - 50,
                pointerEvents: "none",
              }}
            >
              +{tapCount}
            </Typography>
          )}
        </Button>
        <MobileErr />
        <Box
          sx={{
            mt: "40px",
            pb: "20px",
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
            {/* Your Energy: {Math.floor((energy / 100) * 100)}% */}
            Your Energy: {energy}%
          </Typography>
          <ProgressBar energy={energy} />
        </Box>
      </Box>
    </Box>
  );
}

export default Tapalka;
