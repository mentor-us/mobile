import InActive from './send-icon.svg';
import Active from './sendable-icon.svg';

const SendIcon = ({focused}) => {
  if (focused) {
    return <Active />;
  }
  return <InActive />;
};

export default SendIcon;
