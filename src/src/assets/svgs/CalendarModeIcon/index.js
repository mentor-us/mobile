import DateMode from "./calendar-day.svg";
import ThreeDateMode from "./calendar-three-day.svg";
import WeekMode from "./calendar-week.svg";
import MonthMode from "./calendar-month.svg";

const CalendarModeIcon = ({ mode }) => {
  switch (mode) {
    case "day":
      return <DateMode />;
    case "threeDays":
      return <ThreeDateMode />;
    case "week":
      return <WeekMode />;
    case "month":
      return <MonthMode />;
    default:
      return <WeekMode />;
  }
};

export default CalendarModeIcon;
