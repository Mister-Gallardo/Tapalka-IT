import axios from "axios";

export async function PostData(userID: string, coins: number, energy: number) {
  try {
    const { data } = await axios.post(
      `http://127.0.0.1:8002/test/user_exit/${userID}?coins=${coins.toFixed(
        1
      )}&energy=${energy.toFixed(1)}`
    );
    console.log("Данные отправлены: ", data);
  } catch (e) {
    console.log("Ошибка:", e);
  }
}

export async function GetData(
  userID: string,
  setCoins: (newValue: number) => void,
  setEnergy: (newValue: number) => void
) {
  try {
    const { data } = await axios.get(
      `http://127.0.0.1:8002/test/user_entry_check/${userID}`
    );
    console.log("Данные получены: ", data);
    setCoins(data.coins);
    setEnergy(data.energy);
  } catch (e) {
    console.log("Ошибка:", e);
  }
}
