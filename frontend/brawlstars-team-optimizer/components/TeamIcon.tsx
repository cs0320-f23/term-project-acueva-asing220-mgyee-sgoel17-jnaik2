import React from "react";
import Avatar from "@mui/material/Avatar";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

interface TeamCellProps {
  teamName: string;
  teamIcon: string;
}

/**
 * Produces a cell in the table for team compositions
 */
const TeamCell = ({ teamName, teamIcon }) => (
  <TableRow>
    <TableCell component="th" scope="row">
      <Avatar src={teamIcon} alt={teamName} />
      {teamName}
    </TableCell>
  </TableRow>
);

export default TeamCell;
