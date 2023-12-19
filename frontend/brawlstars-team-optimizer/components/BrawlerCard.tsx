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

/**
 * Generates a list of React elements, each one represents a gadget/star power.
 * @param props Brawl Card Props which include information about the brawler and it's image information
 * @returns A list of React elements that represent, in this order: Star Power (1), Star Power (2), Gadget (1), Gadget (2)
 */
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

/**
 * Generates a Brawl Card element that has the Brawler's icon image, its name, and its star power/gadget images.
 * @param props Brawl Card Props which include information about the brawlers clicked in the Drop Down Check Box
 * @returns A rendered Brawl Card component element
 */
export function BrawlerCard(props: BrawlerCardProps) {
  if (props.globalBrawlerLinks !== undefined) {
    return (
      <Card
        sx={{ display: "flex", maxWidth: 500 }}
        aria-label={`Player ${props.playerNumber} Card for ${props.brawlerName}`}
      >
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
