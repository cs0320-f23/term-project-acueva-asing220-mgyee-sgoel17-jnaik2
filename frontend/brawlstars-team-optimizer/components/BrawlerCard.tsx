"use client";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { brawlerURLS } from "@/components/brawlerIcons";

interface BrawlerCardProps {
  brawlerName: string;
  globalBrawlerLinks: brawlerURLS;
  gadgets: [number, string][];
  starPowers: [number, string][];
  defaultID: boolean;
  playerNumber: number;
}

function generateIcons(props: BrawlerCardProps): React.JSX.Element[] {
  let gridArray: React.JSX.Element[] = [];
  for (const [globalStarPowerInfo, starPowerIcon] of props.globalBrawlerLinks
    .starPowers) {
    const icon: React.JSX.Element = (
      <Grid item xs={3}>
        <img
          src={starPowerIcon}
          alt={globalStarPowerInfo[1]}
          className={
            props.starPowers.some(
              (info) => info[0] == globalStarPowerInfo[0]
            ) || !props.defaultID
              ? "unlockedIcon"
              : "lockedIcon"
          }
        />
      </Grid>
    );
    gridArray.push(icon);
  }
  for (const [globalGadgetInfo, gadgetIcon] of props.globalBrawlerLinks
    .gadgets) {
    const icon: React.JSX.Element = (
      <Grid item xs={3}>
        <img
          src={gadgetIcon}
          alt={globalGadgetInfo[1]}
          className={
            props.gadgets.some((info) => info[0] == globalGadgetInfo[0]) ||
            !props.defaultID
              ? "unlockedIcon"
              : "lockedIcon"
          }
        />
      </Grid>
    );
    gridArray.push(icon);
  }
  return gridArray;
}

//    <Grid item xs={3}>
//   <img src={iconLink} alt={iconName} className="lockedIcon" />
// </Grid>

export function BrawlerCard(props: BrawlerCardProps) {
  if (props.globalBrawlerLinks !== undefined) {
    return (
      <Card sx={{ display: "flex", maxWidth: 500 }} aria-label={`Player ${props.playerNumber} Card for ${props.brawlerName}`}>
        <CardMedia
          sx={{ width: 60, height: 100, objectFit: "scale-down" }}
          component="img"
          image={props.globalBrawlerLinks.brawler}
          title={`${props.brawlerName} image`}
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5" component="div">
                {props.brawlerName}
              </Typography>
            </Grid>
            <Grid container spacing={1} item xs={12}>
              {generateIcons(props)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
