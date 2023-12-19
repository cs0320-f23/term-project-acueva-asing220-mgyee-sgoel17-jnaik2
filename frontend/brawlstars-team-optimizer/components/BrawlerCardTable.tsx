"use client";
import { Grid } from "@mui/material";
import { BrawlerCard } from "./BrawlerCard";
import React, { useEffect, useState } from "react";
import { brawlerURLS } from "@/components/brawlerIcons";
import { toTitleCase } from "./DropDownCheckBox";

interface BrawlerCardTableProps {
  preferredBrawlers: Set<string>; //names
  globalBrawlersInformation: Map<string, brawlerURLS>;
  playerBrawlersInformation: Map<
    string,
    [[number, string][], [number, string][]]
  >;
  defaultID: boolean;
  playerNumber: number;
}

/**
 * Converts the selected Brawlers into a list of rendered Brawler Card elements
 * @param props Brawler Card Table Prop that includes information about which
 * brawlers are selected & the player/globally available star powers/gadgets
 * @returns A list of rendered Brawler Card elements that can be displayed in
 * a vertical grid in BrawlerCardTable
 */
function populateBrawlerCardTable(props: BrawlerCardTableProps) {
  return Array.from(props.preferredBrawlers).map((name) => {
    const playerBrawlerInformation = props.playerBrawlersInformation.get(
      name.toUpperCase()
    );
    const globalBrawlerInformation = props.globalBrawlersInformation.get(name);
    if (globalBrawlerInformation) {
      return (
        <Grid item xs={12} key={name}>
          <BrawlerCard
            brawlerName={name}
            globalBrawlerLinks={globalBrawlerInformation}
            gadgets={
              playerBrawlerInformation ? playerBrawlerInformation[1] : [] //possible issue
            }
            starPowers={
              playerBrawlerInformation ? playerBrawlerInformation[0] : []
            }
            defaultID={props.defaultID}
            playerNumber={props.playerNumber}
          />
        </Grid>
      );
    }
  });
}

/**
 * Generates a Brawl Card Table that has one Brawler Card for each Brawler selected
 * @param props Brawler Card Table Prop that includes information about which
 * brawlers are selected & the player/globally available star powers/gadgets
 * @returns A rendered Brawl Card Table element
 */
export function BrawlerCardTable(props: BrawlerCardTableProps) {
  return (
    <Grid
      container
      spacing={1}
      aria-label={`Brawler Card Table for Player ${props.playerNumber}`}
    >
      {populateBrawlerCardTable(props)}
    </Grid>
  );
}
