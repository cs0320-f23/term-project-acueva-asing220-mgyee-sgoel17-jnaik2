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
  brawlersOwned: Set<string>;
  preferredBrawlers: Set<string>;
  setPreferredBrawlers: React.Dispatch<React.SetStateAction<Set<string>>>;
  playerNumber: number;
}

/**
 * Produces a drop down checkbox menu that has selectable Brawlers
 * @param props checkBoxesProp that includes a list of available brawlers and
 * player available
 * @returns Renders a drop down checkbox menu that can be typed in and selected
 * for brawlers
 */
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

  function isDisabled(option: Map<string, string>) {
    if (boxProps.brawlersOwned.size == 0) {
      return false;
    }

    const brawlerName = option.get("Brawler Name");
    if (!brawlerName) {
      return false;
    }

    return !boxProps.brawlersOwned.has(brawlerName.toUpperCase());
  }

  function sortOptions() {
    const disabledOptions: Map<string, string>[] = [];
    const enabledOptions: Map<string, string>[] = [];
    allBrawlers.forEach((option) => {
      if (isDisabled(option)) {
        disabledOptions.push(option);
      } else {
        enabledOptions.push(option);
      }
    });

    // Moving enabled options to the top
    return [...enabledOptions, ...disabledOptions];
  }

  useEffect(() => {
    setAllBrawlers(tuplesToDictionaries(boxProps.currentBrawlers));
  }, [boxProps.currentBrawlers]);

  return (
    <Autocomplete
      aria-label={`Preferred Brawlers for Player ${boxProps.playerNumber}`}
      multiple
      id="checkboxes-tags-demo"
      options={sortOptions()}
      getOptionDisabled={(option) => {
        return isDisabled(option);
      }}
      disableCloseOnSelect
      // sx={listBoxStyle}
      getOptionLabel={(option) => {
        const brawlerName = option.get("Brawler Name");
        return brawlerName ? brawlerName : "Unknown";
      }}
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props} aria-label={option.get("Brawler Name")}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              aria-label={option.get("Brawler Name")}
            />
            {option.get("Brawler Name")}
          </li>
        );
      }}
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
          console.log(preferences);
          boxProps.setPreferredBrawlers(preferences);
        } else {
          boxProps.setPreferredBrawlers(new Set<string>());
        }
      }}
    />
  );
}

/**
 * Produces a titled case string
 * @param str string to title case
 * @returns A titled case string
 */
export function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => {
    return match.toUpperCase();
  });
}
