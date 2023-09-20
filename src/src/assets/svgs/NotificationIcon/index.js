import Notification from './notification_icon.svg';
import HasNewNotification from './notification_icon_has_new.svg';

const NotificationIcon = ({hasNotification = false}) => {
  return hasNotification ? (
    <HasNewNotification width={20} height={20} />
  ) : (
    <Notification width={20} height={20} />
  );
};

export default NotificationIcon;
