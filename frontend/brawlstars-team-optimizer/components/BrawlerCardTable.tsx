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
}

function populateBrawlerCardTable(props: BrawlerCardTableProps) {
  console.log("LOOK HERE");
  console.log(props.defaultID);
  return Array.from(props.preferredBrawlers).map((name) => {
    const playerBrawlerInformation = props.playerBrawlersInformation.get(
      name.toUpperCase()
    );
    const globalBrawlerInformation = props.globalBrawlersInformation.get(name);
    // console.log("LOOK HERE TEST");
    // console.log(props.playerBrawlersInformation);
    // console.log(name);
    // console.log(globalBrawlerInformation);
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
          />
        </Grid>
      );
    }
  });
}

export function BrawlerCardTable(props: BrawlerCardTableProps) {
  return (
    <Grid container spacing={1}>
      {populateBrawlerCardTable(props)}
    </Grid>
  );
}
