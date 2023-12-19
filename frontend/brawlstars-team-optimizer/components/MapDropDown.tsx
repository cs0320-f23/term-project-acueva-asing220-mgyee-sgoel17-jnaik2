import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface DropDownProps {
  currentMode: string;
  allMapModes: [string, string[]][];
  setCurrentMap: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Produces a drop down menu for available maps
 * @param props DropDownProps which lists the available maps for a specific mode
 * @returns Renders a drop down checkbox menu that can be singly selected
 */
export default function MapDropDown(props: DropDownProps) {
  const [value, setValue] = useState<string>("");
  let viableMaps: string[] = [];
  props.allMapModes.forEach(([mode, maps]) => {
    if (mode == props.currentMode) {
      viableMaps = viableMaps.concat(maps);
    }
  });

  const handleChange = (event: SelectChangeEvent) => {
    const mode: string = event.target.value as string;
    setValue(mode);
    props.setCurrentMap(mode);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Map</InputLabel>
        <Select
          labelId="simple-mode-select"
          id="Map Select Dropdown"
          value={value}
          label="Map Selector"
          onChange={handleChange}
        >
          {viableMaps.map((map) => {
            return <MenuItem value={map}>{map}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Box>
  );
}

/**
 * Produces a camel case string
 * @param str string to camel case
 * @returns A camel cased string
 */
function camelToTitleCase(str: string) {
  const camelCaseString = str.match(/[A-Z]*[a-z]+/g);
  console.log(camelCaseString);

  if (camelCaseString) {
    const titleCaseString = camelCaseString
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return titleCaseString;
  }
  return str;
}
