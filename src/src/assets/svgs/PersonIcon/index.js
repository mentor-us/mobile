import InActive from './person_icon.svg';
import Active from './person_icon_active.svg';

const PersonIcon = ({focused}) => {
  if (focused) {
    return <Active />;
  }
  return <InActive />;
};

export default PersonIcon;
