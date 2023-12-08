import { Grid } from "@mui/material";
import { BrawlerCard } from "./BrawlerCard";
import * as React from "react";

interface BrawlerCardTableProps {
  preferredBrawlers: Set<string>; //names
}

function populateBrawlerCardTable(brawlerSet: string[]) {
  return brawlerSet.map((name) => (
    <Grid item xs={12}>
      <BrawlerCard brawlerName={name}></BrawlerCard>
    </Grid>
  ));
}

export function BrawlerCardTable(props: BrawlerCardTableProps) {
    return <Grid container spacing={1}>
      {populateBrawlerCardTable(Array.from(props.preferredBrawlers))}
  </Grid>;
}
