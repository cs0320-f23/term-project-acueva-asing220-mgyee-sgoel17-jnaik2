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
