import InActive from "./schedule_icon.svg";
import Active from "./schedule_icon_active.svg";

const ScheduleIcon = ({focused}) => {
  if (focused) {
    return <Active />;
  }
  return <InActive />;
};

export default ScheduleIcon;
