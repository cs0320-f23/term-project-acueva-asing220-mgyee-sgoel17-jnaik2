"use client";
import "@/styles/App.css";
import NavBar from "@/components/NavBar";
import { Banner as ErrorBanner } from "@/components/Banner";
import CheckBoxes from "@/components/CheckBoxes";
import { ControlledInput as InputBox } from "@/components/InputBox";
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
  preferredBrawlers: Set<string>; //names
  setPreferredBrawlers: React.Dispatch<React.SetStateAction<Set<string>>>;
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
    };
  };

  const [allBrawlers, setAllBrawlers] = useState<[string, string][]>([]);
  const [errorBanner, setErrorBanner] = useState<Error>(Error.NO_ERROR); // 0 for no banner, 1 for error with api, 2 for [insert here]
  const [errorText, setErrorText] = useState<string>("");
  const player1 = usePlayerState(1);
  const player2 = usePlayerState(2);
  const player3 = usePlayerState(3);

  async function getCurrentBrawlers(): Promise<[string, string][]> {
    const fetchJson = await fetch("http://localhost:8000/populateBrawlerData");
    const currentBrawlers = await fetchJson.json();
    let brawlerIDPair: [string, string] = ["temp", "temp"];
    let allPairs: [string, string][] = [];
    if (!currentBrawlers) {
      setErrorBanner(Error.NO_JSON_ERROR);
      return [["noJson", "noJson"]]; //Do error checking, maybe display a banner?
    }
    if (!currentBrawlers.items) {
      setErrorBanner(Error.API_ERROR);
      return [["typeError", "typeError"]]; //Do error checking, maybe display a banner?
    }

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

  async function checkValidity() {
    tagOrderChecker();
    if (errorBanner === Error.NO_ERROR) {
      await checkAllTags();
    }
  }

  function tagOrderChecker() {
    const playerList: string[] = [player3.tag, player2.tag, player1.tag];
    let flag: boolean = false;

    for (const tag of playerList) {
      if (tag !== "") {
        if (flag) {
          setErrorBanner(Error.WRONG_ORDER_ERROR);
          return;
        } else {
          flag = true;
        }
      }
    }
    setErrorBanner(Error.NO_ERROR);
    return;

    // if (player1.tag === "" && (player2.tag !== "" || player3.tag !== "")) {
    //   setErrorBanner(Error.WRONG_ORDER_ERROR);
    // }

    // if (player1.tag !== "" && player2.tag === "" && player3.tag !== "") {
    //   setErrorBanner(Error.WRONG_ORDER_ERROR);
    // } else {
    //   setErrorBanner(Error.NO_ERROR);
    // }
  }

  // TODO, ensure that the banner is what we want!
  async function checkAllTags() {
    if (player1.tag === "") {
      setErrorBanner(Error.NO_TAG_ERROR);
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

  // fetching the current brawlers available
  useEffect(() => {
    const fetchCurrentBrawlerData = async () => {
      const currentBrawlers = await getCurrentBrawlers();
      setAllBrawlers(currentBrawlers);
    };
    fetchCurrentBrawlerData();
    console.log("fetched all brawler data!");
  }, []);

  useEffect(() => {
    errorToBannerText(errorBanner);
  }, [errorBanner]);

  return (
    <div>
      <NavBar />
      {errorBanner !== Error.NO_ERROR && (
        <ErrorBanner bannerTitle={"Error:"} bannerText={errorText} />
      )}

      <div className="tagContainerBox">
        <div className="tagBox">
          <div className="checkBox">
            {player1.isValid && (
              <CheckBoxes
                currentBrawlers={allBrawlers}
                brawlersOwned={player1.brawlersOwned}
                preferredBrawlers={player1.preferredBrawlers}
                setPreferredBrawlers={player1.setPreferredBrawlers}
              ></CheckBoxes>
            )}
          </div>
          <InputBox
            helperText={player1.helperText}
            value={player1.tag}
            setValue={player1.setTag}
            handleSubmit={() => checkValidity()}
            setValid={player1.setIsValid}
          />
        </div>

        <div className="tagBox">
          <div className="checkBox">
            {player1.isValid && player2.isValid && (
              <CheckBoxes
                currentBrawlers={allBrawlers}
                brawlersOwned={player2.brawlersOwned}
                preferredBrawlers={player2.preferredBrawlers}
                setPreferredBrawlers={player2.setPreferredBrawlers}
              ></CheckBoxes>
            )}
          </div>
          <InputBox
            helperText={player2.helperText}
            value={player2.tag}
            setValue={player2.setTag}
            handleSubmit={() => checkValidity()}
            setValid={player2.setIsValid}
          />
        </div>

        <div className="tagBox">
          <div className="checkBox">
            {player1.isValid && player2.isValid && player3.isValid && (
              <CheckBoxes
                currentBrawlers={allBrawlers}
                brawlersOwned={player3.brawlersOwned}
                preferredBrawlers={player3.preferredBrawlers}
                setPreferredBrawlers={player3.setPreferredBrawlers}
              ></CheckBoxes>
            )}
          </div>
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
}

async function checkPlayerTag(player: Player) {
  console.log("Reached player tag function");
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
      console.log("FIRST CHECKPOINT");
      return false;
    } else {
      console.log("SECOND CHECKPOINT");
      player.setIsValid(true);
      await updateBrawlersOwned(player, tagData);
      return true;
    }
  }
  return false;
}

async function updateBrawlersOwned(player: Player, rawBrawlerData: any) {
  if (rawBrawlerData) {
    if (rawBrawlerData.brawlers && rawBrawlerData.brawlers[0]) {
      // ensure you can see at least one brawler
      rawBrawlerData.brawlers.map((brawler: any) => {
        player.setBrawlersOwned(player.brawlersOwned.add(brawler.name));
      });
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
    return "Please enter player ID's in this order: Player 1, Player 2, and Player 3.";
  } else if (error == Error.NO_TAG_ERROR) {
    return "Please enter a tag for the player";
  }
}
