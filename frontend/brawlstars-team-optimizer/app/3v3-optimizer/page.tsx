"use client";
import "@/styles/App.css";
import NavBar from "@/components/NavBar";
import { Banner as ErrorBanner } from "@/components/Banner";
import CheckBoxes from "@/components/checkboxes";
import { ControlledInput as InputBox } from "@/components/InputBox";
import React, { useEffect, useState } from "react";
import DropDownCheckboxesTags from "@/components/DropDownCheckBox";
import DropDownCheckBox from "@/components/DropDownCheckBox";
import ReactTable from "@/components/ReactTable";
import { BrawlerCard } from "@/components/BrawlerCard";
import { BrawlerCardTable } from "@/components/BrawlerCardTable";

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

const ngrokServerURL =
  "https://159f-2620-6e-6000-3100-6481-ff51-677-dd27.ngrok-free.app/";

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
  const [errorText, setErrorText] = useState<string>("dxd");
  const player1 = usePlayerState(1);
  const player2 = usePlayerState(2);
  const player3 = usePlayerState(3);

  async function getCurrentBrawlers(): Promise<[string, string][]> {
    const fetchJson = await fetch("http://localhost:8000/getAllBrawlers");
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

  // fetching the current brawlers available
  useEffect(() => {
    const fetchCurrentBrawlerData = async () => {
      const currentBrawlers = await getCurrentBrawlers();
      setAllBrawlers(currentBrawlers);
      console.log(currentBrawlers);
    };
    fetchCurrentBrawlerData();
    console.log("fetched all brawler data!");
  }, []);

  useEffect(() => {
    setErrorText(errorToBannerText(errorBanner));
  }, [errorBanner]);

  return (
    <div>
      <NavBar />
      {errorBanner !== Error.NO_ERROR && (
        <ErrorBanner bannerTitle={"Error:"} bannerText={errorText} />
      )}

      <div className="allTagsContainerBox">
        <div className="tagContainerBox">
          <div className="checkBox">
            <DropDownCheckBox
              currentBrawlers={allBrawlers}
              brawlersOwned={player1.brawlersOwned}
              preferredBrawlers={player1.preferredBrawlers}
              setPreferredBrawlers={player1.setPreferredBrawlers}
            />
            <div className="brawlerCardTable">
              <BrawlerCardTable
                preferredBrawlers={player1.preferredBrawlers}
              ></BrawlerCardTable>
            </div>
          </div>
          <div className="tagBox">
            <InputBox
              helperText={player1.helperText}
              value={player1.tag}
              setValue={player1.setTag}
              handleSubmit={() => checkValidity()}
              setValid={player1.setIsValid}
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
            />
          </div>
          <div className="tagBox">
            <InputBox
              helperText={player2.helperText}
              value={player2.tag}
              setValue={player2.setTag}
              handleSubmit={() => checkValidity()}
              setValid={player2.setIsValid}
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
            />
          </div>
          <div className="tagBox">
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

      <div className="tableDiv">
        <ReactTable />
      </div>

      <button
        tabIndex={9}
        id="button"
        onClick={() => {
          console.log("bad click");
        }}
        aria-label="Submit button"
        aria-description="Interprets the text currently entered in the command input textbox as a command and displays the result of executing the command in the result history.
        Alternatively, press the Enter key to submit."
      >
        Find your best brawlers
      </button>
    </div>
  );
}

async function checkPlayerTag(player: Player) {
  console.log("Reached player tag function");
  let tagJson;
  let tagData;
  tagJson = await fetch(
    "http://localhost:8000/getPlayerInventory?player_tag=" + player.tag
  );
  tagData = await tagJson.json();
  if (tagData) {
    console.log(tagData);
    if (tagData.status === "success") {
      console.log("FIRST CHECKPOINT");
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
      console.log("SECOND CHECKPOINT");
      return false;
    }
  }
  return false;
}

async function updateBrawlersOwned(player: Player, rawBrawlerData: any) {
  if (rawBrawlerData) {
    if (rawBrawlerData[0]) {
      rawBrawlerData.map((brawler: any) => {
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
    return "If you enter a player ID, please enter them in this order: Player 1, Player 2, and Player 3";
  } else if (error == Error.NO_TAG_ERROR) {
    return "Please enter a tag for the player";
  }

  return "Something went wrong, please try again later";
}
