import { Grid } from "@mui/material";
import { BrawlerCard } from "./BrawlerCard";
import * as React from "react";
import { brawlerURLS } from "@/app/brawlerIcons";
import { iconMap } from "@/app/brawlerIcons";

interface BrawlerCardTableProps {
  preferredBrawlers: Set<string>; //names
}

async function populateBrawlerCardTable(props: BrawlerCardTableProps) {
  const brawlerIcons = await iconMap;
  return Array.from(props.preferredBrawlers).map((name) => (
    <Grid item xs={12}>
      <BrawlerCard
        brawlerName={name}
        brawlerInformation={brawlerIcons.get(name)}
      ></BrawlerCard>
    </Grid>
  ));
}

export async function BrawlerCardTable(props: BrawlerCardTableProps) {
  return (
    <Grid container spacing={1}>
      {populateBrawlerCardTable(props)}
    </Grid>
  );
}
