import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface DropDownProps {
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
  allMapModes: [string, string[]][];
}

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
              <MenuItem value={modeMapTuple[0]}>{modeMapTuple[0]}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
