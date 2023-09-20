import InActive from './task_icon.svg';
import Active from './task_icon_active.svg';

const TaskIcon = ({focused}) => {
  if (focused) {
    return <Active />;
  }
  return <InActive />;
};

export default TaskIcon;
