import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useEffect, useState } from "react";
import "@/styles/App.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface checkBoxesProps {
  currentBrawlers: [string, string][];
  brawlersOwned: Set<string>; //names
  preferredBrawlers: Set<string>; //names
  setPreferredBrawlers: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function DropDownCheckboxesTags(boxProps: checkBoxesProps) {
  const [allBrawlers, setAllBrawlers] = useState<Map<string, string>[]>([]);
  function tuplesToDictionaries(currentBrawlerNameIDPairs: [string, string][]) {
    return currentBrawlerNameIDPairs.map((brawlerNameIDPair) => {
      let map = new Map<string, string>();
      map.set("Brawler Name", toTitleCase(brawlerNameIDPair[0]));
      map.set("Brawler ID", brawlerNameIDPair[1]);
      return map;
    });
  }
  console.log("lkjdfkljd;asjfldaskjf");

  useEffect(() => {
    setAllBrawlers(tuplesToDictionaries(boxProps.currentBrawlers));
  }, [boxProps.currentBrawlers]);
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={allBrawlers}
      disableCloseOnSelect
      getOptionLabel={(option) => {
        const brawlerName = option.get("Brawler Name");
        return brawlerName ? brawlerName : "Unknown";
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.get("Brawler Name")}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Preferred Brawlers"
          placeholder="Brawlers"
        />
      )}
      onChange={(event, value) => {
        if (value) {
          const preferences = new Set<string>();
          value.map((brawlerNameIDMap) => {
            const brawlerName = brawlerNameIDMap.get("Brawler Name");
            if (brawlerName) {
                preferences.add(brawlerName);
            }
          });
          boxProps.setPreferredBrawlers(preferences);
        } else {
            boxProps.setPreferredBrawlers(new Set<string>());
        }
        console.log(boxProps.preferredBrawlers);
      }}
    />
  );
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => {
    return match.toUpperCase();
  });
}
