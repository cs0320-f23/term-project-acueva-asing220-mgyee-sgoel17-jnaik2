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
          return props.brawlersOwned.has(brawlerIDNamePair[1]) ? (
            <FormControlLabel
              control={<Checkbox />}
              key={brawlerIDNamePair[0]}
              checked={checked}
              onClick={() => {
                let addBrawler = !checked;
                setChecked(!checked);
                if (addBrawler) {
                  props.setPreferredBrawlers(
                    props.preferredBrawlers.add(brawlerIDNamePair[1])
                  );
                } else {
                  props.setPreferredBrawlers(() => {
                    const preferredBrawlers = props.preferredBrawlers;
                    preferredBrawlers.delete(brawlerIDNamePair[1]);
                    return preferredBrawlers;
                  });
                }
              }}
              label={toTitleCase(brawlerIDNamePair[1])}
            />
          ) : (
            <FormControlLabel
              disabled
              control={<Checkbox />}
              key={brawlerIDNamePair[0]}
              checked={checked}
              label={toTitleCase(brawlerIDNamePair[1])}
            />
          );
        })}
      </FormGroup>
    </div>
  );
}

function toTitleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
