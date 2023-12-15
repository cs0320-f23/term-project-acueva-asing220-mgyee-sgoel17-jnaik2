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

// function createData(
//   teamName1: string,
//   teamName2: string,
//   teamName3: string,
//   winRate: number,
//   trueSkill: number
// ) {
//   return {
//     id: (teamName1 + teamName2 + teamName3).toLowerCase().replace(/\s+/g, "-"),
//     teamName1,
//     teamIcon1: "https://cdn.brawlify.com/profile/28000000.png?v=1", // Replace with the actual icon URL
//     teamName2,
//     teamIcon2: "https://cdn.brawlify.com/profile/28000000.png?v=1", // Replace with the actual icon URL
//     teamName3,
//     teamIcon3: "https://cdn.brawlify.com/profile/28000000.png?v=1", // Replace with the actual icon URL
//     winRate,
//     trueSkill,
//   };
// }

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

// const rows = [
//   createData("Brawler 1", "Brawler 2", "Brawler 3", 10, 4),
//   createData("Brawler 4", "Brawler 5", "Brawler 6", 1, 42),
// ];

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

export function BasicTable(props: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              <StyledTableCell align="center">
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
              <StyledTableCell align="center">{team.score}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
