"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./profile.css";
import OutlinedCard from "@/components/ProfileCard";

/**
 * Function to render Profile Component on screen
 * @return - Profile Component to return on screen
 */
function Profile() {
  const [playerTag, setPlayerTag] = useState("");

  // Hook effect to listen for changes in authentication of user
  useEffect(() => {
    // console.log("Reached here");

    /**
     * Checks if user is authorized, and if it is, get their playerTag from firestore and display to user. If not signed in,
     * return that statement to user
     * @param {Object} user - Current user of webapp
     */
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // console.log("Reached inside");
        // User is signed in, get user data from Firestore
        // const userDoc = await getDoc(doc(db, "users", user.uid));
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);
        // console.log("Reached here 2");
        if (userSnap.exists()) {
          // console.log("Reached inside exists block");
          // console.log(userSnap.data().playerTag);
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
        // console.log("Reached inside not exists block");
        setPlayerTag("No one is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  // Rendering the Profile Component using OutlinedCard and ProfileCard component

  return (
    <div className="profile-div">
      <NavBar />
      <div className="profile-card-div">
        <OutlinedCard playerTag={playerTag} />
      </div>
    </div>
  );
}

// Exporting Profile Component
export default Profile;
