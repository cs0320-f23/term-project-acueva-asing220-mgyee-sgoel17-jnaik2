// "use client";

// import Image from "next/image";
// import Example from "./sampleComponent";
// import { ControlledInput as InputBox } from "./InputBox";
// import SampleBox from "./SampleBox";
// import { useState } from "react";

// export default function InputTextBox() {
//   const [value, setValue] = useState<string>("");
//   const [helperText, setHelperText] = useState<string>("Ask for data");
//   const [resultValue, setResultValue] = useState<string>("");
//   return (
//     <div>
//       <InputBox
//         helperText={helperText}
//         value={value}
//         setValue={setValue}
//         handleSubmit={async function (keywords: string): Promise<void> {
//           /**
//            * This function makes calls to backend for the searching of the Geo
//            * Json data that eventually culminates into areas being highlighted
//            * in a hot pink color
//            *
//            * @params keywords: the words the user types into the search box
//            */

//           let fetchJson;
//           let val;
//           if (value === "battleLog") {
//             fetchJson = await fetch(
//               "http://localhost:8000/getBattleLog?player_tag=22Q90QJV"
//             );
//             val = "";
//           } else if (value === "playerData") {
//             fetchJson = await fetch(
//               "http://localhost:8000/getPlayerData?player_tag=22Q90QJV"
//             );
//             val = "";
//           } else if (value === "bestGlobalPlayersData") {
//             fetchJson = await fetch(
//               "http://localhost:8000/getBestGlobalPlayers"
//             );
//             val = "";
//           } else if (value === "MapRotationData") {
//             fetchJson = await fetch("http://localhost:8000/getMapRotation");
//             val = "";
//           } else if (value === "populateCurrentBrawlersData") {
//             fetchJson = await fetch(
//               "http://localhost:8000/populateBrawlerData"
//             );
//             val = "";
//           } else {
//             val = "Please try a correct search";
//           }
//           setValue("");

//           if (val == "") {
//             const brawlData = await fetchJson?.json();
//             setResultValue(JSON.stringify(brawlData));
//           } else {
//             setHelperText(val);
//           }
//         }}
//       />

//       <SampleBox data={resultValue}></SampleBox>
//     </div>
//   );
// }
