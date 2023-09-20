import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';
import {Badge, Surface, Title} from 'react-native-paper';

interface Props {
  style?: string;
  menu?: string;
  onPressMenu?: () => void;
  back?: boolean;
  onPressBack?: () => void;
  title?: string;
  right?: string;
  rightComponent?: any;
  onRightPress?: () => void;
  optionalButton?: any;
  optionalButtonPress?: () => void;
  headerBg?: string;
  iconColor?: string;
  titleAlign?: string;
  opntionalBadge?: any;
}

export default function BackHeader({
  style,
  menu,
  onPressMenu,
  back,
  onPressBack,
  title,
  right,
  rightComponent,
  onRightPress,
  optionalButton,
  optionalButtonPress,
  headerBg = 'white',
  iconColor = 'black',
  titleAlign,
  opntionalBadge,
}: Props) {
  const LeftView = () => (
    <View style={styles.view}>
      {menu && (
        <TouchableOpacity onPress={onPressMenu}>
          <Feather name={menu} size={24} color={iconColor} />
        </TouchableOpacity>
      )}
      {back && (
        <TouchableOpacity onPress={onPressBack}>
          <Feather name="x" size={24} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );

  const TitleView = () => (
    <View style={styles.titleView}>
      <Title style={styles.title}>{title}</Title>
    </View>
  );

  const RightView = () =>
    rightComponent ? (
      rightComponent
    ) : (
      <View style={[styles.view, styles.rightView]}>
        {optionalButton && (
          <TouchableOpacity
            style={styles.rowView}
            onPress={optionalButtonPress}>
            <Feather nme={optionalButton} size={24} color={iconColor} />
            {opntionalBadge && (
              <Badge style={styles.badge}>{opntionalBadge}</Badge>
            )}
          </TouchableOpacity>
        )}
        {right && (
          <TouchableOpacity onPress={onRightPress}>
            <Feather name={right} size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    );

  return (
    <Surface style={[styles.header, style]}>
      <View style={styles.headerView}>
        <LeftView />
        <TitleView />
        <RightView />
      </View>
    </Surface>
  );
}
