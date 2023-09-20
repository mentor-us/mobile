import InActive from './setting_icon.svg';
import Active from './setting_icon_active.svg';

const TaskIcon = ({focused}) => {
  if (focused) {
    return <Active width={24} height={24} />;
  }
  return <InActive width={24} height={24} />;
};

export default TaskIcon;
