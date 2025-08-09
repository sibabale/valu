import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CloseIcon = ({fill = "#e3e3e3", height = "24px", width = "24px", ...props}: any) => {
    return (
  <Svg
    height={height}
    viewBox="0 -960 960 960"
    width={width}
    fill={fill}
    {...props}
  >
    <Path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </Svg>
)}
;
export default CloseIcon;
