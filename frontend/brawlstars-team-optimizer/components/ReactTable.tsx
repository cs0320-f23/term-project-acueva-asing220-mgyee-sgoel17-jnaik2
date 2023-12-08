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

// function createData(team: string, winrate: number, trueskill: number) {
//   return { team, winrate, trueskill };
// }

// function createData();

// const createData = (teamName, winrate, trueskill) => ({
//   team: (
//     <TeamCell
//       teamName={teamName}
//       teamIcon="https://cdn.brawlify.com/profile/28000000.png?v=1"
//     />
//   ),
//   winrate,
//   trueskill,
// });

// function createData(
//   teamName1: string,
//   teamName2: string,
//   teamName3: string,
//   winRate: number,
//   trueSkill: number
// ) {
//   return {
//     id: (teamName1 + teamName2 + teamName3).toLowerCase().replace(/\s+/g, "-"), // Generate a unique ID based on teamName
//     team: (
//       <TeamCell
//         key={teamName1}
//         teamName={teamName1}
//         teamIcon="https://cdn.brawlify.com/profile/28000000.png?v=1"
//       />
//     ),
//     winRate,
//     trueSkill,
//   };
// }

function createData(
  teamName1: string,
  teamName2: string,
  teamName3: string,
  winRate: number,
  trueSkill: number
) {
  return {
    id: (teamName1 + teamName2 + teamName3).toLowerCase().replace(/\s+/g, "-"),
    teamName1,
    teamIcon1: "https://cdn.brawlify.com/profile/28000000.png?v=1", // Replace with the actual icon URL
    teamName2,
    teamIcon2: "https://cdn.brawlify.com/profile/28000000.png?v=1", // Replace with the actual icon URL
    teamName3,
    teamIcon3: "https://cdn.brawlify.com/profile/28000000.png?v=1", // Replace with the actual icon URL
    winRate,
    trueSkill,
  };
}

// function createData(
//   teamName1: string,
//   teamName2: string,
//   teamName3: string,
//   winRate: number,
//   trueskill: number
// ) {
//   return
//     {
//       id: (teamName1+teamName2+teamName3).toLowerCase().replace(/\s+/g, "-"),
//     //   team: (
//     //     <div>
//     //     {//   <TeamCell
//     //     //     teamName={teamName1}
//     //     //     teamIcon="https://cdn.brawlify.com/profile/28000000.png?v=1"
//     //     //   />
//     //     //   <TeamCell
//     //     //     teamName={teamName2}
//     //     //     teamIcon="https://cdn.brawlify.com/profile/28000000.png?v=1"
//     //     //   />
//     //     //   <TeamCell
//     //     //     teamName={teamName3}
//     //     //     teamIcon="https://cdn.brawlify.com/profile/28000000.png?v=1"
//     //     //   />}
//     //     </div>
//     //   ),
//       winRate,
//       trueskill,
//     };
// }

// const createData = async (
//   teamName: string,
//   winrate: number,
//   trueskill: number
// ) => {
//   const icons = await fetchTeamIcons();

//   return {
//     team: icons.map((icon, index) => ({ icon, label: `Element ${index + 1}` })),
//     winrate,
//     trueskill,
//   };
// };

const sample_url = "https://cdn.brawlify.com/profile/28000000.png?v=1";

// const fetchTeamIcons = async () => {
//   // Fetch icons from the API and return them
//   // Example:
//   const response = await fetch("your-api-endpoint");
//   const data = await response.json();
//   return data.icons;
// };

// TeamInfo component to render team information as a card
// const TeamInfo = ({ team }) => (
//   <div>
//     {team.map(({ icon, label }) => (
//       <div key={label}>
//         <img src={icon} alt={label} width="30" height="30" />{" "}
//         {/* Adjust width and height as needed */}
//         <p>{label}</p>
//       </div>
//     ))}
//   </div>
// );

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

const rows = [
  createData("Brawler 1", "Brawler 2", "Brawler 3", 10, 4),
  createData("Brawler 4", "Brawler 5", "Brawler 6", 1, 42),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center">Team</StyledTableCell>
            <StyledTableCell align="center">Win rate</StyledTableCell>
            <StyledTableCell align="center">True Skill</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {/* <StyledTableCell align="center">{row.team}</StyledTableCell>
              <StyledTableCell align="center">{row.winRate}</StyledTableCell>
              <StyledTableCell align="center">{row.trueSkill}</StyledTableCell> */}

              <StyledTableCell align="center">
                <TeamCell teamName={row.teamName1} teamIcon={row.teamIcon1} />
                <br />
                <TeamCell
                  teamName={row.teamName2}
                  teamIcon={row.teamIcon2}
                />{" "}
                <br />
                <TeamCell teamName={row.teamName3} teamIcon={row.teamIcon3} />
              </StyledTableCell>
              <StyledTableCell align="center">{row.winRate}</StyledTableCell>
              <StyledTableCell align="center">{row.trueSkill}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
