import InActive from './chat_icon.svg';
import Active from './chat_icon_active.svg';

const ChatIcon = ({focused}) => {
  if (focused) {
    return <Active />;
  }
  return <InActive />;
};

export default ChatIcon;
