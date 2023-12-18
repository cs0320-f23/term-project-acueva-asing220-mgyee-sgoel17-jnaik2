"use client";
import "@/styles/App.css";
import NavBar from "@/components/NavBar";
import { Banner as ErrorBanner } from "@/components/Banner";
import CheckBoxes from "@/components/checkboxes";
import { ControlledInput as InputBox } from "@/components/InputBox";
import React, { useEffect, useState } from "react";
import DropDownCheckboxesTags from "@/components/DropDownCheckBox";
import DropDownCheckBox from "@/components/DropDownCheckBox";
import { BasicTable, team } from "@/components/ReactTable";
import { BrawlerCard } from "@/components/BrawlerCard";
import { BrawlerCardTable } from "@/components/BrawlerCardTable";
import { brawlerURLS, populateIcons } from "../../components/brawlerIcons";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ModeDropDown from "@/components/ModeDropDown";
import MapDropDown from "@/components/MapDropDown";
import PastTeams from "../past-teams/page";

interface Player {
  tag: string;
  isValid: boolean;
  brawlersOwned: Set<string>;
  helperText: string;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
  setBrawlersOwned: React.Dispatch<React.SetStateAction<Set<string>>>;
  setHelperText: React.Dispatch<React.SetStateAction<string>>;
  preferredBrawlers: Set<string>; //names
  setPreferredBrawlers: React.Dispatch<React.SetStateAction<Set<string>>>;
  brawlerBuildMap: Map<string, [[number, string][], [number, string][]]>; //[starPowers, gadgets]
  setBrawlerBuildMap: React.Dispatch<
    React.SetStateAction<Map<string, [[number, string][], [number, string][]]>>
  >;
  playerNumber: number;
}
export enum Error {
  NO_ERROR,
  API_ERROR,
  NO_JSON_ERROR,
  GENERAL_ERROR,
  INVALID_TAG1_ERROR,
  INVALID_TAG2_ERROR,
  INVALID_TAG3_ERROR,
  SAME_TAG_ERROR,
  WRONG_ORDER_ERROR,
  NO_TAG_ERROR,
}

// const serverURL =
//   "https://159f-2620-6e-6000-3100-6481-ff51-677-dd27.ngrok-free.app";
const serverURL = "http://localhost:8000";

export default function TeamOpt3v3() {
  const usePlayerState = (playerNumber: number): Player => {
    const [tag, setTag] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [brawlersOwned, setBrawlersOwned] = useState<Set<string>>(
      new Set<string>()
    );
    const [helperText, setHelperText] = useState<string>(
      "Please Input Player " + playerNumber + "'s tag"
    );
    const [preferredBrawlers, setPreferredBrawlers] = useState<Set<string>>(
      new Set<string>()
    );
    const [brawlerBuildMap, setBrawlerBuildMap] = useState<
      Map<string, [[number, string][], [number, string][]]>
    >(new Map<string, [[number, string][], [number, string][]]>());

    return {
      tag,
      isValid,
      brawlersOwned,
      helperText,
      setTag,
      setIsValid,
      setBrawlersOwned,
      setHelperText,
      preferredBrawlers,
      setPreferredBrawlers,
      brawlerBuildMap,
      setBrawlerBuildMap,
      playerNumber,
    };
  };

  const [globalBuildMap, setGlobalBuildMap] = useState<
    Map<string, [[number, string][], [number, string][]]>
  >(new Map<string, [[number, string][], [number, string][]]>());
  const [rows, setRows] = useState<team[]>([]);
  const [iconMap, setIconMap] = useState<Map<string, brawlerURLS>>(
    new Map<string, brawlerURLS>()
  );
  const [signedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check user authentication status when the component mounts
    const checkAuthentication = () => {
      if (auth.currentUser) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    };

    checkAuthentication(); // Initial check

    // Subscribe to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);
  const [allBrawlers, setAllBrawlers] = useState<[string, string][]>([]);
  const [allMapModes, setAllMapModes] = useState<[string, string[]][]>([]);
  const [currentMode, setCurrentMode] = useState<string>("Select a mode");
  const [currentMap, setCurrentMap] = useState<string>("Select a map");
  const [errorBanner, setErrorBanner] = useState<Error>(Error.NO_ERROR); // 0 for no banner, 1 for error with api, 2 for [insert here]
  const [errorText, setErrorText] = useState<string>("dxd");
  const player1 = usePlayerState(1);
  // const [player1, setPlayer1] = useState(usePlayerState(1));
  const player2 = usePlayerState(2);
  const player3 = usePlayerState(3);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (auth.currentUser) {
  //       const user = auth.currentUser;
  //       const userRef = doc(db, "Users", user.uid);

  //       try {
  //         const userSnap = await getDoc(userRef);
  //         if (userSnap.exists()) {
  //           console.log("Reached inside userSnap exists");
  //           const userData = userSnap.data();
  //           const playerTag = userData.playerTag;
  //           console.log(playerTag);
  //           if (playerTag) {
  //             // Update the state of player1 with the fetched player tag
  //             setPlayer1((prevPlayer1) => ({
  //               ...prevPlayer1,
  //               helperText: playerTag,
  //               tag: playerTag,
  //             }));
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data from Firestore:", error);
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  async function getCurrentBrawlers(): Promise<[string, string][]> {
    const fetchJson = await fetch(serverURL + "/getAllBrawlers");
    const currentBrawlers = await fetchJson.json();
    if (currentBrawlers) {
      if (currentBrawlers.status === "success") {
        return currentBrawlers.data.map(
          (brawlerNameIDPair: [string, number]) => {
            return [brawlerNameIDPair[0], brawlerNameIDPair[1].toString()];
          }
        );
      }
      setErrorBanner(Error.API_ERROR);
    }
    setErrorBanner(Error.API_ERROR);
    return [["Invalid", "Invalid"]];
  }

  //not sure if this will stay like this, will probably just set the state
  // instead of returning
  async function getModeMapData(): Promise<[string, string[]][]> {
    const fetchJson = await fetch(serverURL + "/getMapRotation");
    const allMapModePairs = await fetchJson.json();
    if (allMapModePairs) {
      if (allMapModePairs.status === "success") {
        // will be in a for each loop
        const modeMapTuples: [string, string[]][] = [];
        const modeMaps: [string, string[]] = ["Mode 1", ["Map 1", "Map2"]];
        const currMaps = new Set<string>();
        allMapModePairs.data.map((mapData) => {
          const mode: string = mapData.event.mode;
          const map: string = mapData.event.map;

          if (currMaps.has(mode)) {
            modeMapTuples.map(([currMode, maps]) => {
              if (currMode === mode) {
                return [mode, [...maps, map]];
              }
              return [currMode, maps];
            });
          } else {
            currMaps.add(mode);
            modeMapTuples.push([mode, [map]]);
          }
        });
        // if we need specific mode order, we can manipulate dictionary
        // to be an ordered list of maps
        return modeMapTuples;
      }
      setErrorBanner(Error.API_ERROR);
    }
    setErrorBanner(Error.API_ERROR);
    return [];
  }

  async function checkValidity() {
    tagOrderChecker();
    if (errorBanner === Error.NO_ERROR) {
      await checkAllTags();
    }
  }

  function tagOrderChecker() {
    if (player1.tag === "" && (player2.tag !== "" || player3.tag !== "")) {
      setErrorBanner(Error.WRONG_ORDER_ERROR);
    } else if (player1.tag !== "" && player2.tag === "" && player3.tag !== "") {
      setErrorBanner(Error.WRONG_ORDER_ERROR);
    } else {
      setErrorBanner(Error.NO_ERROR);
    }
  }

  // TODO, ensure that the banner is what we want!
  async function checkAllTags() {
    if (player1.tag === "") {
      // setErrorBanner(Error.NO_TAG_ERROR);
      return;
    }

    if (!player1.isValid) {
      let valid = await checkPlayerTag(player1);
      if (!valid) {
        console.log("Reached invalid tag 1 error");
        setErrorBanner(Error.INVALID_TAG1_ERROR);
        return;
      }
    }

    if (player2.tag === "") {
      return;
    }

    if (!player2.isValid) {
      if (player1.tag === player2.tag) {
        setErrorBanner(Error.SAME_TAG_ERROR);
        return;
      }

      const valid = await checkPlayerTag(player2);

      if (
        errorBanner === Error.NO_ERROR &&
        (typeof valid === "undefined" || !valid)
      ) {
        setErrorBanner(Error.INVALID_TAG2_ERROR);
        return;
      }
    }

    if (player3.tag === "") {
      return;
    }

    if (!player3.isValid) {
      if (player1.tag === player3.tag || player2.tag === player3.tag) {
        setErrorBanner(Error.SAME_TAG_ERROR);
        return;
      }

      const valid = await checkPlayerTag(player3);

      if (
        errorBanner === Error.NO_ERROR &&
        (typeof valid === "undefined" || !valid)
      ) {
        setErrorBanner(Error.INVALID_TAG3_ERROR);
        return;
      }
    }
  }

  async function getPlayerTag() {
    if (auth.currentUser) {
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user?.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const playerTag = data.playerTag;
        if (playerTag == "") {
          alert(
            "You have not registered a player tag yet. Please do so by going to settings."
          );
          return;
        }
        console.log(playerTag);
        player1.setTag(playerTag);
      } else {
        console.log("No profile exists for this user");
      }
    }

    return;
  }

  function getBrawlerList(): Set<string>[] {
    let brawlerList: Set<string>[] = [];
    const players = [player1, player2, player3];
    for (const player of players) {
      if (player.preferredBrawlers.size !== 0) {
        brawlerList.push(player.preferredBrawlers);
      } else if (player.isValid) {
        brawlerList.push(player.brawlersOwned);
      } else {
        brawlerList.push(
          new Set(
            allBrawlers.map(([name, id]) => {
              return name;
            })
          )
        );
      }
    }
    return brawlerList;
  }

  // fetching the current brawlers available
  useEffect(() => {
    const fetchCurrentBrawlerData = async () => {
      const currentBrawlers = await getCurrentBrawlers();
      setAllBrawlers(currentBrawlers);
      console.log(currentBrawlers);
    };
    fetchCurrentBrawlerData();
    console.log("Fetched all brawler data!");
  }, []);

  useEffect(() => {
    async function initializeIcons() {
      const brawlerLinks = await populateIcons();
      setIconMap(brawlerLinks);
    }
    initializeIcons();
  }, [allBrawlers]);

  useEffect(() => {
    const fetchModeMapData = async () => {
      const data = await getModeMapData();
      setAllMapModes(data);
      console.log(allMapModes);
    };
    fetchModeMapData();
  }, []);

  useEffect(() => {
    setErrorText(errorToBannerText(errorBanner));
  }, [errorBanner]);

  return (
    <div className="content">
      <div>
        <NavBar />
        {errorBanner !== Error.NO_ERROR && (
          <ErrorBanner
            bannerTitle={"Error:"}
            bannerText={errorText}
            setErrorBanner={setErrorBanner}
          />
        )}
      </div>
      <div className="standardFlex">
        <div className="menu">
          <ModeDropDown
            setCurrentMode={setCurrentMode}
            allMapModes={allMapModes}
          />
        </div>
        <div className="menu">
          <MapDropDown
            setCurrentMap={setCurrentMap}
            allMapModes={allMapModes}
            currentMode={currentMode}
          />
        </div>
      </div>

      <div className="allTagsContainerBox">
        <div className="tagContainerBox">
          <div className="checkBox">
            <DropDownCheckBox
              currentBrawlers={allBrawlers}
              brawlersOwned={player1.brawlersOwned}
              preferredBrawlers={player1.preferredBrawlers}
              setPreferredBrawlers={player1.setPreferredBrawlers}
              playerNumber={player1.playerNumber}
            />
            <div className="brawlerCardTable">
              {iconMap && (
                <BrawlerCardTable
                  preferredBrawlers={player1.preferredBrawlers}
                  globalBrawlersInformation={iconMap}
                  playerBrawlersInformation={player1.brawlerBuildMap}
                  defaultID={player1.isValid}
                                    playerNumber={player1.playerNumber}
                ></BrawlerCardTable>
              )}
            </div>
          </div>
          <div className="tagBox">
            <InputBox
              helperText={player1.helperText}
              value={player1.tag}
              setValue={player1.setTag}
              handleSubmit={() => checkValidity()}
              setValid={player1.setIsValid}
              playerNumber={player1.playerNumber}
            />
          </div>
        </div>

        <div className="tagContainerBox">
          <div className="checkBox">
            <DropDownCheckBox
              currentBrawlers={allBrawlers}
              brawlersOwned={player2.brawlersOwned}
              preferredBrawlers={player2.preferredBrawlers}
              setPreferredBrawlers={player2.setPreferredBrawlers}
              playerNumber={player2.playerNumber}
            />
            <div className="brawlerCardTable">
              {iconMap && (
                <BrawlerCardTable
                  preferredBrawlers={player2.preferredBrawlers}
                  globalBrawlersInformation={iconMap}
                  playerBrawlersInformation={player2.brawlerBuildMap}
                  defaultID={player2.isValid}
                  playerNumber={player2.playerNumber}
                ></BrawlerCardTable>
              )}
            </div>
          </div>

          <div className="tagBox">
            <InputBox
              helperText={player2.helperText}
              value={player2.tag}
              setValue={player2.setTag}
              handleSubmit={() => checkValidity()}
              setValid={player2.setIsValid}
              playerNumber={player2.playerNumber}
            />
          </div>
        </div>

        <div className="tagContainerBox">
          <div className="checkBox">
            <DropDownCheckBox
              currentBrawlers={allBrawlers}
              brawlersOwned={player3.brawlersOwned}
              preferredBrawlers={player3.preferredBrawlers}
              setPreferredBrawlers={player3.setPreferredBrawlers}
              playerNumber={player3.playerNumber}
            />
            <div className="brawlerCardTable">
              {iconMap && (
                <BrawlerCardTable
                  preferredBrawlers={player3.preferredBrawlers}
                  globalBrawlersInformation={iconMap}
                  playerBrawlersInformation={player3.brawlerBuildMap}
                  defaultID={player3.isValid}
                                    playerNumber={player3.playerNumber}
                ></BrawlerCardTable>
              )}
            </div>
          </div>
          <div className="tagBox">
            <InputBox
              helperText={player3.helperText}
              value={player3.tag}
              setValue={player3.setTag}
              handleSubmit={() => checkValidity()}
              setValid={player3.setIsValid}
              playerNumber={player3.playerNumber}
            />
          </div>
        </div>
      </div>

      {/* This will be a div containing the menus and button, flex side */}
      <div className="standardFlex">
        {/* This div will contain the menus (flex vert) */}
        {auth.currentUser && (
          <div className="optimizerButton" onClick={getPlayerTag}>
            <button>Enter to get your stored player tag for Player 1</button>
          </div>
        )}
        <button
          tabIndex={9}
          id="button"
          className="optimizerButton"
          onClick={async () => {
            let teamsToBeAdded;
            const setTable = async () => {
              const brawlers: Set<string>[] = getBrawlerList();
              const teams = await populateTable(
                brawlers,
                currentMode,
                currentMap
              );
              teamsToBeAdded = teams;
              setRows(teams);
            };
            setTable();
            if (auth.currentUser) {
              const userRef = doc(db, "Users", auth.currentUser?.uid);

              const userDoc = await getDoc(userRef);

              if (userDoc.exists()) {
                const currentPastTeams: team[] = userDoc.data().PastTeams || [];
                const newPastTeams = [...currentPastTeams, ...[teamsToBeAdded]];
                await updateDoc(userRef, {
                  pastTeams: newPastTeams,
                });
              }
            }
          }}
          aria-label="Submit button"
          aria-description="Interprets the text currently entered in the command input textbox as a command and displays the result of executing the command in the result history.
        Alternatively, press the Enter key to submit."
        >
          Find your best brawlers
        </button>
      </div>
      <div className="tableDiv">
        <BasicTable rows={rows} iconMap={iconMap} />
      </div>
    </div>
  );
}

async function checkPlayerTag(player: Player) {
  let tagJson;
  let tagData;
  tagJson = await fetch(
    serverURL + "/getPlayerInventory?playerTag=" + player.tag
  );
  tagData = await tagJson.json();
  if (tagData) {
    console.log(tagData);
    if (tagData.status === "success") {
      player.setIsValid(true);
      await updateBrawlersOwned(player, tagData.data.brawlers);
      return true;
    } else {
      let tag = player.tag;
      let helperText = player.helperText;

      player.setHelperText("Please make sure you give a valid brawler ID");
      player.setTag("");
      setTimeout(() => {
        player.setTag(tag);
        player.setHelperText(helperText);
      }, 3000);
      return false;
    }
  }
  return false;
}

async function updateBrawlersOwned(player: Player, rawBrawlerData: any) {
  if (rawBrawlerData) {
    if (rawBrawlerData[0]) {
      const brawlerBuildMap = new Map<
        string,
        [[number, string][], [number, string][]]
      >();
      rawBrawlerData.map((brawler: any) => {
        const brawlerName: string = brawler.name;
        player.setBrawlersOwned(player.brawlersOwned.add(brawlerName));
        let starPowerList: [number, string][] = [];
        let gadgetList: [number, string][] = [];
        for (const starPower of brawler["starPowers"]) {
          const starPowerInfo: [number, string] = [
            starPower.id,
            starPower.name,
          ];
          starPowerList.push(starPowerInfo);
        }
        for (const gadget of brawler["gadgets"]) {
          const gadgetInfo: [number, string] = [gadget.id, gadget.name];
          gadgetList.push(gadgetInfo);
        }
        brawlerBuildMap.set(brawlerName, [starPowerList, gadgetList]);
      });
      player.setBrawlerBuildMap(brawlerBuildMap);
    }
  }
}

function errorToBannerText(error: Error) {
  if (error == Error.NO_ERROR) {
    return "No error";
  } else if (error == Error.API_ERROR) {
    return "The brawl stars server is down, please try again later";
  } else if (error == Error.NO_JSON_ERROR) {
    return "The server is down, please try again later";
  } else if (error == Error.GENERAL_ERROR) {
    return "Something went wrong, please try again later";
  } else if (error == Error.INVALID_TAG1_ERROR) {
    return "Player 1's ID is not valid. Please try again";
  } else if (error == Error.INVALID_TAG2_ERROR) {
    return "Player 2's ID is not valid. Please try again";
  } else if (error == Error.INVALID_TAG3_ERROR) {
    return "Player 3's ID is not valid. Please try again";
  } else if (error == Error.SAME_TAG_ERROR) {
    return "Each Player must have a unique tag";
  } else if (error == Error.WRONG_ORDER_ERROR) {
    return "If you enter a player ID, please enter them in this order: Player 1, Player 2, and Player 3";
  } else if (error == Error.NO_TAG_ERROR) {
    return "Please enter a tag for the player";
  }

  return "Something went wrong, please try again later";
}

async function populateTable(
  brawlers: Set<string>[],
  mode: string,
  map: string
): Promise<team[]> {
  let rankings = [];
  for (const brawlerSet of brawlers) {
    const rankData = [];
    for (const brawler of brawlerSet) {
      const ratingData = await fetch(
        serverURL + "/getBrawlerRating?brawlerName=" + brawler
      );
      const ratingJson = await ratingData.json();
      if (ratingJson.status == "success") {
        rankData.push(ratingJson.data);
      }
    }
    rankings.push(rankData);
  }

  const averages = new Map<Set<string>, number>();
  const list1 = rankings[0];
  const list2 = rankings[1];
  const list3 = rankings[2];

  for (let i = 0; i < list1.length; i++) {
    for (let j = 0; j < list2.length; j++) {
      if (list2[j]["brawler-name"] === list1[i]["brawler-name"]) {
        continue;
      }
      for (let k = 0; k < list3.length; k++) {
        if (
          list3[k]["brawler-name"] === list2[j]["brawler-name"] ||
          list3[k]["brawler-name"] === list1[i]["brawler-name"]
        ) {
          continue;
        }
        let average: number = -100;
        if (mode !== "Select a mode") {
          if (
            !list1[i]["map-ratings"][mode] ||
            !list2[j]["map-ratings"][mode] ||
            !list3[k]["map-ratings"][mode]
          ) {
            continue;
          }
          if (map !== "Select a map") {
            if (
              !list1[i]["map-ratings"][mode][map] ||
              !list2[j]["map-ratings"][mode][map] ||
              !list3[k]["map-ratings"][mode][map]
            ) {
              continue;
            }
            average =
              (list1[i]["map-ratings"][mode][map]["combined-exposure"] +
                list2[j]["map-ratings"][mode][map]["combined-exposure"] +
                list3[k]["map-ratings"][mode][map]["combined-exposure"]) /
              3;
          } else {
            average =
              (list1[i]["mode-ratings"][mode]["combined-exposure"] +
                list2[j]["mode-ratings"][mode]["combined-exposure"] +
                list3[k]["mode-ratings"][mode]["combined-exposure"]) /
              3;
          }
        } else {
          average =
            (list1[i]["global-rating"]["combined-exposure"] +
              list2[j]["global-rating"]["combined-exposure"] +
              list3[k]["global-rating"]["combined-exposure"]) /
            3;
        }
        const names = new Set<string>([
          toTitleCase(list1[i]["brawler-name"]),
          toTitleCase(list2[j]["brawler-name"]),
          toTitleCase(list3[k]["brawler-name"]),
        ]);
        if (!averages.has(names)) {
          averages.set(names, average);
        }
      }
    }
  }

  const averagesList = [...averages];
  averagesList.sort((a, b) => b[1] - a[1]);

  const topTeams: [string[], number][] = averagesList
    .slice(0, 10)
    .map((team) => [[...team[0]], team[1]]);

  console.log(topTeams);
  // const team1: team = {
  //   b1: "Shelly",
  //   b2: "Colt",
  //   b3: "Crow",
  //   score: 20,
  // };
  // const json = [team1];
  let teams: team[] = [];
  for (const brawlerTeam of topTeams) {
    const teamToBeAdded: team = {
      b1: brawlerTeam[0][0],
      b2: brawlerTeam[0][1],
      b3: brawlerTeam[0][2],
      score: brawlerTeam[1],
    };
    teams.push(teamToBeAdded);
  }
  return teams;
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => {
    return match.toUpperCase();
  });
}
