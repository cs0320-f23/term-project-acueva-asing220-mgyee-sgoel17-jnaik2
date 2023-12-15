import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface OutlinedCardProps {
  playerTag: string;
}

// const card = (
//   <React.Fragment>
//     <CardContent>
//       <Typography variant="h5" component="div">
//         Profile
//       </Typography>
//       <Typography sx={{ mb: 1.5 }} color="text.secondary">
//         Playertag: {playerTag}
//       </Typography>
//       <Typography variant="body2"></Typography>
//     </CardContent>
//     {/* <CardActions>
//       <Button size="small">Learn More</Button>
//     </CardActions> */}
//   </React.Fragment>
// );

// export default function OutlinedCard() {
//   return (
//     <Box sx={{ minWidth: 275 }}>
//       <Card variant="outlined">{card}</Card>
//     </Box>
//   );
// }

const OutlinedCard: React.FC<OutlinedCardProps> = ({ playerTag }) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            className="profile-card-profile"
          >
            Profile
          </Typography>
          <Typography
            sx={{ mb: 1.5 }}
            color="text.secondary"
            className="profile-card-playerTag"
          >
            Playertag: {playerTag}
          </Typography>
          {/* Additional content or actions */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OutlinedCard;
