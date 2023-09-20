import InActive from './home_icon.svg';
import Active from './home_icon_active.svg';

const HomeIcon = ({focused}) => {
  if (focused) {
    return <Active />;
  }
  return <InActive />;
};

export default HomeIcon;
