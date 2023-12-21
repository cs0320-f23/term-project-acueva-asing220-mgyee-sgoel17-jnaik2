import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TeamCell from "@/components/TeamIcon";
import "@/styles/App.css";
import { brawlerURLS } from "./brawlerIcons";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export interface team {
  b1: string;
  b2: string;
  b3: string;
  score: number;
}

interface Props {
  rows: team[];
  iconMap: Map<string, brawlerURLS>;
}

/**
 * Produces a table containing the best team compositions
 * @param playerTag the string player tag
 * @returns A rendered table containing the best team compositions
 */
export function BasicTable(props: Props) {
  const count = 0;
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        id="brawler result table"
        aria-label="brawler result table"
      >
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center">Team</StyledTableCell>
            <StyledTableCell align="center">Score</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((team) => (
            <StyledTableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell align="center" aria-label="teamCombo">
                <div className="teamCell">
                  <TeamCell
                    teamName={team.b1}
                    teamIcon={props.iconMap.get(team.b1)?.brawler}
                  />
                  <TeamCell
                    teamName={team.b2}
                    teamIcon={props.iconMap.get(team.b2)?.brawler}
                  />
                  <TeamCell
                    teamName={team.b3}
                    teamIcon={props.iconMap.get(team.b3)?.brawler}
                  />
                </div>
              </StyledTableCell>
              <StyledTableCell align="center">
                {(team.score + 100).toString()}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
