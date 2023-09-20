import UnMark from './unmark_icon.svg';
import Marked from './marked_icon.svg';

const MarkIcon = ({ marked }) => {
  if (marked) {
    return <Marked width={20} height={20} />;
  }
  return <UnMark width={20} height={20} />;
};

export default MarkIcon;
