import * as React from "react";
import Svg, { Path } from "react-native-svg";
const   TrendUpIcon = ({fill='#e3e3e3', height='24px', width='24px'}: {fill?: string, height?: string, width?: string, viewBox?: string}) => (
  <Svg
    height={height}
    viewBox="0 -960 960 960"
    width={width}
    fill={fill}
  >
    <Path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
  </Svg>
);
export default TrendUpIcon;
