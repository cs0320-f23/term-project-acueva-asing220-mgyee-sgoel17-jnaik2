import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from "react";

interface BrawlerCardProps {
  brawlerName: string;
}

export function BrawlerCard(props: BrawlerCardProps) {
  const brawlerImage: string =
    "https://cdn-old.brawlify.com/profile/28000000.png";
  return (
    <Card sx={{ display: "flex", maxWidth: 500 }}>
      <CardMedia
        sx={{ width: 80, height: 120, objectFit: "scale-down" }}
        component="img"
        image={brawlerImage}
        title={`${props.brawlerName} image`}
      />
      <CardContent sx={{ width: 20 }}>
        <Typography gutterBottom variant="h5" component="div">
          {props.brawlerName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gadgets/StarsPowers
        </Typography>
      </CardContent>
    </Card>
  );
}
