import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ChevronDownIcon = ({ fill = '#e3e3e3' }: { fill?: string }) => (
  <Svg height="24px" viewBox="0 -960 960 960" width="24px" fill={fill}>
    <Path d="M480-432 296-248l-56-56 240-240 240 240-56 56-184-184Z" />
  </Svg>
);

export default ChevronDownIcon;
