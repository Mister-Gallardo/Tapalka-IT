import { Box, Typography } from "@mui/material";

const ProgressBar = ({ energy }: { energy: number }) => {
  const fillWidth = `${Number((energy / 1000).toFixed(2)) * 100}%`;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "45px",
        backgroundColor: "#22001B",
        borderRadius: "25px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: fillWidth,
          height: "100%",
          borderRadius: "25px",
          background: "linear-gradient(to right, #FF6E05, #F83C27)",
          transition: "width 0.3s ease",
        }}
      >
        <Typography
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: "white",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          {energy}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
