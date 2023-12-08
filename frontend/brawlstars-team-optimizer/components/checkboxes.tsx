import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Brawler } from "next/font/google";
import React, { useState } from "react";

interface checkBoxProps {
  currentBrawlers: [string, string][];
  brawlersOwned: Set<string>; //names
  preferredBrawlers: Set<string>; //names
  setPreferredBrawlers: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function CheckBoxes(props: checkBoxProps) {
  console.log(props.preferredBrawlers);
  return (
    <div>
      <FormGroup>
        {props.currentBrawlers.map((brawlerIDNamePair) => {
          const [checked, setChecked] = useState<boolean>(false);
          return props.brawlersOwned.has(brawlerIDNamePair[0]) ? (
            <FormControlLabel
              control={<Checkbox />}
              key={brawlerIDNamePair[1]}
              checked={checked}
              onClick={() => {
                let addBrawler = !checked;
                setChecked(!checked);
                if (addBrawler) {
                  props.setPreferredBrawlers(
                    props.preferredBrawlers.add(brawlerIDNamePair[0])
                  );
                } else {
                  props.setPreferredBrawlers(() => {
                    const preferredBrawlers = props.preferredBrawlers;
                    preferredBrawlers.delete(brawlerIDNamePair[0]);
                    return preferredBrawlers;
                  });
                }
              }}
              label={toTitleCase(brawlerIDNamePair[0])}
            />
          ) : (
            <FormControlLabel
              disabled
              control={<Checkbox />}
              key={brawlerIDNamePair[1]}
              checked={checked}
              label={toTitleCase(brawlerIDNamePair[0])}
            />
          );
        })}
      </FormGroup>
    </div>
  );
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => {
    return match.toUpperCase();
  });
}
