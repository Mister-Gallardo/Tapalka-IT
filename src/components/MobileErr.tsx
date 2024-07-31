import { Typography } from "@mui/material";

function MobileErr() {
  return (
    <Typography
      sx={{
        display: { xs: "none", md: "block" },
        fontSize: "38px",
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      Продолжите на мобильном устройстве
    </Typography>
  );
}

export default MobileErr;
