"use client";
import { Grid } from "@mui/material";
import { BrawlerCard } from "./BrawlerCard";
import React, { useEffect, useState } from "react";
import { brawlerURLS } from "@/components/brawlerIcons";

interface BrawlerCardTableProps {
  preferredBrawlers: Set<string>; //names
  globalBrawlerInformation: Map<string, brawlerURLS>;
  playerBrawlerInformation: Map<
    string,
    [[number, string][], [number, string][]]
  >;
}

function populateBrawlerCardTable(props: BrawlerCardTableProps) {
  return Array.from(props.preferredBrawlers).map((name) => (
const brawlerInformation = props.playerBrawlerInformation.get(name)
    <Grid item xs={12}>
      <BrawlerCard
        brawlerName={name}
        globalBrawlerLinks={props.globalBrawlerInformation.get(name)}
        gadgets={
          props.playerBrawlerInformation.get(name)
            ? props.playerBrawlerInformation.get(name)[0]
            : []
        }
        starPowers={
          props.playerBrawlerInformation.get(name)
            ? props.playerBrawlerInformation.get(name)[1]
            : []
        }
      ></BrawlerCard>
    </Grid>
  ));
}

export function BrawlerCardTable(props: BrawlerCardTableProps) {
  return (
    <Grid container spacing={1}>
      {populateBrawlerCardTable(props)}
    </Grid>
  );
}
