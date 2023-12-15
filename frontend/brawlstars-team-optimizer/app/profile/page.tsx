"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./profile.css";
import OutlinedCard from "@/components/ProfileCard";

function Profile() {
  const [playerTag, setPlayerTag] = useState("");
  useEffect(() => {
    console.log("Reached here");
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("Reached inside");
        // User is signed in, get user data from Firestore
        // const userDoc = await getDoc(doc(db, "users", user.uid));
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);
        console.log("Reached here 2");
        if (userSnap.exists()) {
          console.log("Reached inside exists block");
          console.log(userSnap.data().playerTag);
          if (userSnap.data().playerTag) {
            setPlayerTag(userSnap.data().playerTag);
          } else {
            setPlayerTag("You have not set up your player tag");
          }
        } else {
          console.log(user.uid);
          console.log("user doc not exist");
        }
      } else {
        console.log("Reached inside not exists block");
        setPlayerTag("No one is signed in");
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="profile-div">
      <NavBar />
      <div className="profile-card-div">
        <OutlinedCard playerTag={playerTag} />
      </div>
    </div>
  );
}

export default Profile;
