import InActive from './like_icon.svg';
import Active from './like_icon_active.svg';

const LikeIcon = ({focused}) => {
  if (focused) {
    return <Active width={20} height={20} />;
  }
  return <InActive width={20} height={20} />;
};

export default LikeIcon;
