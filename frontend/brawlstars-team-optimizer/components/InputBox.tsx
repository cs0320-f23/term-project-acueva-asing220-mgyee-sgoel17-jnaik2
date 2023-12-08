import "@/styles/App.css";
import { Dispatch, SetStateAction, useState } from "react";

/**
 * Props that are used to control/store the input given by the user
 *
 * value: a string representing the value in the input box
 * setValue: a function that sets the value
 * ariaLabel: a label that can be used to later call and test the component
 */
interface ControlledInputProps {
  handleSubmit: (a: string) => void;
  helperText: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  setValid: Dispatch<SetStateAction<boolean>>;
}

/**
 * A function that controls the input given by the user
 *
 * @param - ControlledProps: See interface comment
 * @returns: an input component with the given value and ariaLabel
 */
export function ControlledInput(props: ControlledInputProps) {
  return (
    <input
      type="text"
      className="inputField"
      value={props.value}
      placeholder={props.helperText}
      onChange={(ev) => {
        props.setValid(false);
        props.setValue(ev.target.value);
      }} 
      aria-label={"Input box for a player tag"}
      tabIndex={2}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key.toLowerCase() === "enter") {
          props.handleSubmit(props.value);
        }
      }}
    ></input>
  );
}
