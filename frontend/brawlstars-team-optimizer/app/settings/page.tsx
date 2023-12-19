"use client";
import NavBar from "@/components/NavBar";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import "./settings.css";

/**
 * Function to render Settings Component on screen
 * @return - Settings Component to return on screen
 */
function Settings() {
  /**
   * Async function to handle submit for button. On click, it should update playerTag for user in our firestore database
   */
  const handleSubmit = async () => {
    if (!auth.currentUser) {
      alert("Sign in to set a player tag");
    } else if (playerTag == "") {
      alert("Player tag should be non-empty");
    } else {
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        playerTag: playerTag,
      });
      alert("Player tag succesfully changed");
      console.log(user.uid);
      console.log(playerTag);
    }
  };

  /**
   * Handles input change events for the player tag.
   *
   * @param {Object} event - The input change event object.
   */
  const handleInputChange = (event: any) => {
    setPlayerTag(event.target.value);
  };

  const [playerTag, setPlayerTag] = React.useState("");

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          Settings
        </Typography>
        <Typography variant="body2">Set your player tag here</Typography>
        <Box
          sx={{
            display: "flex",
            // justifyContent: "center",
            marginTop: 2,
            minWidth: 300,
          }}
        >
          <Input
            value={playerTag}
            onChange={handleInputChange}
            placeholder="Set your player tag"
          ></Input>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleSubmit}>
          Submit
        </Button>
      </CardActions>
    </React.Fragment>
  );

  // Rendering the Settings Component using MaterialsUI card component
  return (
    <div className="settings-div">
      <NavBar />
      <div className="settings-card-div">
        <Box
          sx={{
            minWidth: 325,
          }}
        >
          <Card variant="outlined">{card}</Card>
        </Box>
      </div>
    </div>
  );
}

// Exporting Settings Component
export default Settings;
