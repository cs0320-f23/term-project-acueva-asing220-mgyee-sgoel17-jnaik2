"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { brawlerURLS, populateIcons } from "../../components/brawlerIcons";
import { onAuthStateChanged } from "firebase/auth";
import { BasicTable, team } from "@/components/ReactTable";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function PastTeams() {
  const [rows, setRows] = useState<team[]>([]);
  const [iconMap, setIconMap] = useState<Map<string, brawlerURLS>>(
    new Map<string, brawlerURLS>()
  );

  useEffect(() => {
    async function initializeIcons() {
      const brawlerLinks = await populateIcons();
      setIconMap(brawlerLinks);
    }
    // getTeamsForRows();

    initializeIcons();
  }, []);

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
  return (
    <div className="profile-div">
      <NavBar />
      <div className="tableDiv">
        <BasicTable rows={rows} iconMap={iconMap} />
      </div>
    </div>
  );
}

export default PastTeams;
