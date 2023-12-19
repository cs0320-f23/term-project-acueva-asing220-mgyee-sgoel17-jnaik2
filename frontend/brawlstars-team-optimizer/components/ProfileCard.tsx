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

/**
 * Produces an outline card that is shown when the profile card is clicked
 * @param playerTag the string player tag
 * @returns Renders an outlined card
 */
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default OutlinedCard;
