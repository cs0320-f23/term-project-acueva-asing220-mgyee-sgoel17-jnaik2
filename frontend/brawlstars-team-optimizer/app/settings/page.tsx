"use client";
import NavBar from "@/components/NavBar";
import OutlinedCard from "@/components/SettingsCard";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./settings.css";

function Settings() {
  return (
    <div className="settings-div">
      <NavBar />
      <div className="settings-card-div">
        <OutlinedCard />
      </div>
    </div>
  );
}

export default Settings;
