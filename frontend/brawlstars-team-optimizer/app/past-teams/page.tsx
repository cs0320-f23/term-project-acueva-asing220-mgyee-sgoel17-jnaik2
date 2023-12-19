"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { brawlerURLS, populateIcons } from "../../components/brawlerIcons";
import { onAuthStateChanged } from "firebase/auth";
import { BasicTable, team } from "@/components/ReactTable";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Function to render PastTeams Component on screen
 * @return - PastTeams Component to return on screen
 */
function PastTeams() {
  const [rows, setRows] = useState<team[]>([]);
  const [iconMap, setIconMap] = useState<Map<string, brawlerURLS>>(
    new Map<string, brawlerURLS>()
  );

  // Hook effect to initialize icons when the component first loads.
  useEffect(() => {
    async function initializeIcons() {
      const brawlerLinks = await populateIcons();
      setIconMap(brawlerLinks);
    }
    // getTeamsForRows();

    initializeIcons();
  }, []);

  // Hook effect to detect for authentican changes in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getTeamsForRows();
      } else {
        return;
      }
    });

    return () => unsubscribe();
  }, []);

  // Async function to get pastTeams from firestore database and set table rows to contian those teams
  async function getTeamsForRows() {
    if (auth.currentUser) {
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        console.log("Got here");
        const data = userDoc.data();
        console.log(data.pastTeams);
        if (data.pastTeams.length == 0) {
          alert("You have no past teams recorded");
          return;
        }
        setRows(data.pastTeams);
      } else {
        return;
      }
    }
  }

  // Rendering the PastTeams Component using BasicTable component
  return (
    <div className="profile-div">
      <NavBar />
      <div className="tableDiv">
        <BasicTable rows={rows} iconMap={iconMap} />
      </div>
    </div>
  );
}

// Exporting PastTeams Component
export default PastTeams;
