import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface DropDownProps {
  allMapModes: [string, string[]][];
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Produces a drop down menu for available modes
 * @param props DropDownProps which lists the available modes for a specific mode
 * @returns Renders a drop down checkbox menu that can be singly selected
 */
export default function ModeDropDown(props: DropDownProps) {
  const [value, setValue] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    const mode: string = event.target.value as string;
    setValue(mode);
    props.setCurrentMode(mode);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Mode</InputLabel>
        <Select
          labelId="simple-mode-select"
          id="Mode Select Dropdown"
          value={value}
          label="Mode Selector"
          onChange={handleChange}
        >
          {props.allMapModes.map((modeMapTuple) => {
            return (
              <MenuItem value={modeMapTuple[0]}>
                {camelToTitleCase(modeMapTuple[0])}
              </MenuItem>
            );
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
