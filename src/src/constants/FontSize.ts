import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const [shortDimension] = width < height ? [width, height] : [height, width];
//Guideline sizes are based on standard ~5.5" screen mobile device
const guidelineBaseWidth = 360;

const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;

export const sizeScale = (size: number, factor = 0.6) =>
  size + (scale(size) - size) * factor;

const FontSize = {
  smallest: sizeScale(8),
  smaller: sizeScale(10),
  small: sizeScale(11),
  normal: sizeScale(12),
  large: sizeScale(14),
  larger: sizeScale(16),
  medium: sizeScale(18),
  huge: sizeScale(20),
  bigger: sizeScale(24),
  biggest: sizeScale(30),
};

export default FontSize;
