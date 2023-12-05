import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./styles/App.css";

interface BoxProps {
  data: string;
}

/**
 * This function returns a component that displays the city, state, and area
 * description (if available) in a red box on the top left corner of the app
 *
 * @param props : legend props used to generate the data associated with them
 * as divs
 * @returns
 */
function SampleBox(props: BoxProps) {
  return (
    <div className="Data-box" aria-label="SampleBox">
      {props.data}
    </div>
  );
}

export default SampleBox;
