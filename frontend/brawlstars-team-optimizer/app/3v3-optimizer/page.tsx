"use client";
import "@/styles/App.css";
import NavBar from "@/components/NavBar";
import CheckBoxes from "@/components/CheckBoxes";
import {ControlledInput as InputBox} from "@/components/InputBox";
import React, { useEffect, useState } from "react";

interface Player {
  tag: string;
  isValid: boolean;
  brawlersOwned: Set<string>;
  helperText: string;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
  setBrawlersOwned: React.Dispatch<React.SetStateAction<Set<string>>>;
  setHelperText: React.Dispatch<React.SetStateAction<string>>;
}

enum Error {
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

export default function TeamOpt3v3() {
  const usePlayerState = (): Player => {
    const [tag, setTag] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);
    const [brawlersOwned, setBrawlersOwned] = useState<Set<string>>(
      new Set<string>()
    );
    const [helperText, setHelperText] = useState<string>(
      "Please Input Your Player Tag"
    );

    return {
      tag,
      isValid,
      brawlersOwned,
      helperText,
      setTag,
      setIsValid,
      setBrawlersOwned,
      setHelperText,
    };
  };

  const [allBrawlers, setAllBrawlers] = useState<[string, string][]>([]);
  const [errorBanner, setErrorBanner] = useState<Error>(Error.NO_ERROR); // 0 for no banner, 1 for error with api, 2 for [insert here]
  const [diffPlayerTags, setDiffPlayerTags] = useState<boolean>(false);
  const player1 = usePlayerState();
  const player2 = usePlayerState();
  const player3 = usePlayerState();

  async function getCurrentBrawlers(): Promise<[string, string][]> {
    const fetchJson = await fetch("http://localhost:8000/populateBrawlerData");
    const currentBrawlers = await fetchJson.json();
    let brawlerIDPair: [string, string] = ["temp", "temp"];
    let allPairs: [string, string][] = [];
    if (currentBrawlers) {
      if (currentBrawlers.type === "success") {
        for (let i = 0; i < currentBrawlers.items.length; i++) {
          brawlerIDPair = [
            String(currentBrawlers.items[i].id),
            currentBrawlers.items[i].name,
          ];
          console.log(brawlerIDPair);
          allPairs.push(brawlerIDPair);
        }
        return allPairs;
      }
      setErrorBanner(Error.API_ERROR);
      return [["typeError", "typeError"]]; //Do error checking, maybe display a banner?
    }
    setErrorBanner(Error.NO_JSON_ERROR);
    return [["noJson", "noJson"]]; //Do error checking, maybe display a banner?
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
    }

    if (player1.tag !== "" && player2.tag === "" && player3.tag !== "") {
      setErrorBanner(Error.WRONG_ORDER_ERROR);
    } else {
      setErrorBanner(Error.NO_ERROR);
    }
  } 

  // TODO, ensure that the banner is what we want!
  async function checkAllTags() {
    if (player1.tag === "") {
      setErrorBanner(Error.NO_TAG_ERROR);
      return;
    }

    if (!player1.isValid) {
      let valid = await checkPlayerTag(player1)
      if (!valid) {
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

      if (errorBanner === Error.NO_ERROR && (typeof valid === "undefined" || !valid)) {
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

      if (errorBanner === Error.NO_ERROR && (typeof valid === "undefined" || !valid)) {
        setErrorBanner(Error.INVALID_TAG3_ERROR);
        return;
      }
    }
  }

  // fetching the current brawlers available
  useEffect(() => {
    const fetchCurrentBrawlerData = async () => {
      const currentBrawlers = await getCurrentBrawlers();
      setAllBrawlers(currentBrawlers);
    };
    fetchCurrentBrawlerData();
  }, []);

  return (
    <div>
      <NavBar />

      <div className="tagContainerBox">
        <div className="tagBox">
          {player1.isValid && (
            <CheckBoxes
              currentBrawlers={allBrawlers}
              brawlersOwned={player1.brawlersOwned}
            ></CheckBoxes>
          )}
          <InputBox
            helperText={player1.helperText}
            value={player1.tag}
            setValue={player1.setTag}
            handleSubmit={() => checkValidity()}
            setValid={player1.setIsValid}
          />
        </div>

        <div className="tagBox">
          {player1.isValid && player2.isValid && (
            <CheckBoxes
              currentBrawlers={allBrawlers}
              brawlersOwned={player2.brawlersOwned}
            ></CheckBoxes>
          )}
          <InputBox
            helperText={player2.helperText}
            value={player2.tag}
            setValue={player2.setTag}
            handleSubmit={() => checkValidity()}
            setValid={player2.setIsValid}
          />
        </div>

        <div className="tagBox">
          {player1.isValid && player2.isValid && player3.isValid && (
            <CheckBoxes
              currentBrawlers={allBrawlers}
              brawlersOwned={player3.brawlersOwned}
            ></CheckBoxes>
          )}
          <InputBox
            helperText={player3.helperText}
            value={player3.tag}
            setValue={player3.setTag}
            handleSubmit={() => checkValidity()}
            setValid={player3.setIsValid}
          />
        </div>
      </div>
    </div>
  );
};

async function checkPlayerTag(player: Player) {
  let tagJson;
  let tagData;
  tagJson = await fetch(
    "http://localhost:8000/getPlayerData?player_tag=" + player.tag
  );
  tagData = await tagJson.json();
  if (tagData) {
    if (tagData.reason) {
      let tag = player.tag;
      let helperText = player.helperText;

      player.setHelperText("Please make sure you give a valid brawler ID");
      player.setTag("");
      setTimeout(() => {
        player.setTag(tag);
        player.setHelperText(helperText);
      }, 3000);
      return false;
    } else {
      player.setIsValid(true);
      await updateBrawlersOwned(player, tagData);
      return true;
    }
  }
}

async function updateBrawlersOwned(player: Player, rawBrawlerData: any) {
  if (rawBrawlerData) {
    if (rawBrawlerData.brawlers && rawBrawlerData.brawlers[0]) { // ensure you can see at least one brawler
      rawBrawlerData.brawlers.map((brawler: any) => {
        player.setBrawlersOwned(player.brawlersOwned.add(brawler.name));
      });
    }
  }
}
// const [playerOneTag, setPlayerOneTag] = useState<string>("");
  // const [playerTwoTag, setPlayerTwoTag] = useState<string>("");
  // const [playerThreeTag, setPlayerThreeTag] = useState<string>("");
  // const [playerOneTagValid, setPlayerOneTagValid] = useState<boolean>(false);
  // const [playerTwoTagValid, setPlayerTwoTagValid] = useState<boolean>(false);
  // const [playerThreeTagValid, setPlayerThreeTagValid] = useState<boolean>(false);
  // const [helperText, setHelperText] = useState<string>("Please Input Your Player Tag");
  // const [playerOneOwned, setPlayerOneOwned] = useState<Set<string>>(
  //   new Set<string>()
  // );
  // const [playerTwoOwned, setPlayerTwoOwned] = useState<Set<string>>(
  //   new Set<string>()
  // );
  // const [playerThreeOwned, setPlayerThreeOwned] = useState<Set<string>>(
  //   new Set<string>()
  // );
  // in case we need to revert to this