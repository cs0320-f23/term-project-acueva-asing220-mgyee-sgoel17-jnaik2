"use client";
import NavBar from "@/components/NavBar";
import React from "react";
import "@/styles/HowTo.css";

export default function HowTo() {
  return (
    <div id="How-to-div">
      <NavBar />
      <div className="howto">
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <strong>
          <b>How to Use this Website</b>
        </strong>
        <br></br>
        <br></br>
        <br></br>
        <b>3v3-Optimizer:</b>
        <br></br>
        <br></br> <b>Mode:</b> Choose the mode that you want to find an optimal
        team for
        <br></br>
        <br></br> <b>Map:</b> If you chose a mode, you can also choose a
        specific map to find an optimal team for
        <br></br>
        <br></br>
        <br></br> <b>Preferred Brawlers:</b> You can select your preferred
        brawlers for each player, so the optimizer will only return teams with
        those brawlers
        <br></br>
        <br></br>
        <br></br> <b>Player Tags:</b> You can input a player tag for each
        player, so the optimizer will only return teams with brawlers that are
        owned
        <br></br>
        <br></br>
        <br></br> <b>Sign Up / Log in:</b>
        <br></br>
        <br></br>You can sign up and create an account so that you can store
        your playerTag, instead of typing it over and over again.
        <br></br> Additionally, you can also view your past recommended teams
        from the recommended teams in the profile bar
        <br></br>
        <br></br>
        <br></br> <b>Profile:</b>
        <br></br>
        <br></br> This is where you can acess your profile settings, past
        recommended teams, setting your playerTag and signing out.
        <br></br>You can access it via the circular logo on the top right. Note
        that the options will be invisible unless you sign up / log in and make
        an account
      </div>
    </div>
  );
}
