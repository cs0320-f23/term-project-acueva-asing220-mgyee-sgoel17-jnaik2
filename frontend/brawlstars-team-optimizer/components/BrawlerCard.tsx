"use client";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { brawlerURLS } from "@/components/brawlerIcons";

interface BrawlerCardProps {
  brawlerName: string;
  globalBrawlerLinks: brawlerURLS | undefined;
  gadgets: [number, string][];
  starPowers: [number, string][];
}

function generateIcons(iconMap: [number, string][], brawlerLinks: brawlerURLS): React.JSX.Element[] {
  return iconMap.map(([iconID, iconName]) => (

    <Grid item xs={3}>
      <img src={iconLink} alt={iconName} className="lockedIcon" />
    </Grid>
  ));
}

export function BrawlerCard(props: BrawlerCardProps) {
  if (props.globalBrawlerLinks !== undefined) {
    return (
      <Card sx={{ display: "flex", maxWidth: 500 }}>
        <CardMedia
          sx={{ width: 80, height: 120, objectFit: "scale-down" }}
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
              {generateIcons(props.gadgets, props.globalBrawlerLinks)}
              {generateIcons(props.starPowers, props.globalBrawlerLinks)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
