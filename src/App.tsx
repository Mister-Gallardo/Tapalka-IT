import { isMobile } from "react-device-detect";
import Tapalka from "./pages/Tapalka";
import "./styles/styles.scss";
import { Box } from "@mui/material";
import MobileErr from "./components/MobileErr";

function App() {
  // localStorage.clear();

  if (!isMobile) {
    return (
      <Box className="main">
        <MobileErr />
      </Box>
    );
  }

  return <Tapalka />;
}

export default App;
