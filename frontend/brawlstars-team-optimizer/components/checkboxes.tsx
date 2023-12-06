import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React from 'react'

interface checkBoxProps {
    currentBrawlers: [string, string][];
    brawlersOwned: Set<string>; //names
}

export default function CheckBoxes(props: checkBoxProps) { 
  return (
    <div>
      {/* {props.currentBrawlers.map((brawlerIDPair) => (
        if () {

        } else {
            
        }
      ))} */}
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
        <FormControlLabel control={<Checkbox />} label="Required" />
        <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
      </FormGroup>
    </div>
  );
}

