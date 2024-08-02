import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ProgressBar from "../components/ProgressBar";
import { IPosition } from "../services/interfaces";
import Debounce from "../heplers/Debounce";
import SetFullScreen from "../heplers/SetFullScreen";
import MobileErr from "../components/MobileErr";
import { SendUpdate } from "../services/api/SendUpdate";
import { GetData, PostData } from "../services/api/FetchData";
import { SocketListener } from "../services/api/WebSocket";

// инициализируем WS и создаём очереди для запросов
let coinsSocket: WebSocket;
const coinsMessageQueue: number[] = [];
let energySocket: WebSocket;
const energyMessageQueue: number[] = [];

function Tapalka() {
  // проверяем на наличие айди в памяти браузера
  const [userID, setUserID] = useState<string | null>(
    localStorage.getItem("userID") ? localStorage.getItem("userID") : null
  );
  // для coins и energy создаём стейт и реф
  // стейт используем для основной логики
  // а реф нам нужен только для того, чтобы отправлять данные на бэк перед закрытием сайта
  const [coins, setCoins] = useState(0);
  const coinsRef = useRef(0);
  const [energy, setEnergy] = useState(1000);
  const energyRef = useRef(1000);
  // isPressed используется для анимации
  const [isPressed, setIsPressed] = useState(false);
  // tapPositin - место нажатия, tapCount - количество одновременных нажатий
  const [tapPosition, setTapPosition] = useState<IPosition | null>(null);
  const [tapCount, setTapCount] = useState(0);

  // в функции handleTap вся логика "тапов"
  const handleTap = (event: React.TouchEvent, energyCount: number) => {
    if (!energyCount) return;

    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 100);

    // ограничиваем количество "тапов" максимум в 4 и проверяем на остаток энергии
    const eventTouch = event.touches.length < 4 ? event.touches.length : 3;
    const touchCount = eventTouch
      ? energyCount - eventTouch >= 0
        ? eventTouch
        : energyCount
      : 1;

    setCoins((prev) => prev + touchCount);
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
  // Из-за этого мы создали функци debounce,
  // которая будет оставлять выполнение только
  // последнего вызова метода onTouchStart.
  // Плюс это поможет защитить приложение от автокликеров

  // P.S. тут специально используется useState,
  // в который передана колбэк функция,
  // чтобы не производить ненужных рендеров этой переменной
  const [debouncedFunc] = useState(() => Debounce(handleTap, 70));

  // убираем tap-message через секунду после отображения
  useEffect(() => {
    const idTap = setTimeout(() => {
      setTapCount(0);
    }, 1000);

    return () => {
      clearTimeout(idTap);
    };
  }, [tapPosition]);

  // для обрабатывания выхоад пользователя избран слушатель на beforeunload
  // этот метод будет срабатывать перед закрытием (обновлением) страницы
  // соответственно тут мы будем отправлять на сервер информацию о пользователе
  useEffect(() => {
    userID &&
      window.addEventListener("beforeunload", () =>
        PostData(userID, coinsRef.current, energyRef.current)
      );

    const idAuto = setInterval(() => {
      setCoins((prev) => prev + 1);
      setEnergy((prev) => (prev < 1000 ? prev + 1 : prev));
    }, 1000);

    // создаём и сохраняем айди пользователя либо подгружаем данные
    if (!userID) {
      const userId = Date.now().toString();
      setUserID(userId);
      localStorage.setItem("userID", userId);
    } else {
      userID && GetData(userID, setCoins, setEnergy);
    }

    return () => {
      userID &&
        window.removeEventListener("beforeunload", () =>
          PostData(userID, coinsRef.current, energyRef.current)
        );
      clearInterval(idAuto);
    };
  }, []);

  useEffect(() => {
    // создаём WS переменные и прописываем логику
    if (userID) {
      try {
        coinsSocket = new WebSocket(
          `ws://127.0.0.1:8002/ws/coins_gain/${userID}/`
        );
        energySocket = new WebSocket(
          `ws://127.0.0.1:8002/ws/energy_gain/${userID}/`
        );
      } catch (e) {
        console.log("ws error: ", e);
      }
      // Слушатели для сокетов
      SocketListener(coinsSocket, coinsMessageQueue);
      SocketListener(energySocket, energyMessageQueue);
    }

    // в функции очистки закрываем сокеты
    return () => {
      if (coinsSocket) coinsSocket.close();
      if (energySocket) energySocket.close();
    };
  }, [userID]);

  useEffect(() => {
    coinsRef.current = coins;
    energyRef.current = energy;
    if (coinsSocket && energySocket) {
      // при изменении значений отправляем на бэк эти данные
      SendUpdate({
        socket: coinsSocket,
        value: coins,
        messageQueue: coinsMessageQueue,
      });
      SendUpdate({
        socket: energySocket,
        value: energy,
        messageQueue: energyMessageQueue,
      });
    }
  }, [coins, energy]);

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
          <Typography>{coins}</Typography>
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
                // отображаем немного выше нажатия
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
            Your Energy: {Math.floor((energy / 1000) * 100)}%
          </Typography>
          <ProgressBar energy={energy} />
        </Box>
      </Box>
    </Box>
  );
}

export default Tapalka;
