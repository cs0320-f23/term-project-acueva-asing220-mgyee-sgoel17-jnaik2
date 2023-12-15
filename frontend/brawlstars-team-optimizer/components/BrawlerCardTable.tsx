"use client";
import { Grid } from "@mui/material";
import { BrawlerCard } from "./BrawlerCard";
import React, { useEffect, useState } from "react";
import { brawlerURLS } from "@/components/brawlerIcons";

interface BrawlerCardTableProps {
  preferredBrawlers: Set<string>; //names
  brawlerInformation: Map<string, brawlerURLS>;
}

function populateBrawlerCardTable(props: BrawlerCardTableProps) {
  return Array.from(props.preferredBrawlers).map((name) => (
    <Grid item xs={12}>
      <BrawlerCard
        brawlerName={name}
        brawlerInformation={props.brawlerInformation.get(name)}
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
