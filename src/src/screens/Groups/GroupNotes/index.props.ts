import {ColumnChartImage, NoteImage, PinImage} from '~/assets/images';
import { ChartIcon } from '~/assets/svgs';

export type TabType = 'voting' | 'pin' | 'note';

export interface TabModel {
  key: TabType;
  title: string;
}

export const RoutesData: TabModel[] = [
  {key: 'voting', title: 'Bình chọn'},
  {key: 'pin', title: 'Tin ghim'},
  {key: 'note', title: 'Ghi chú'},
];

export const Actions = [
  {
    text: 'Tạo bình chọn',
    icon: ChartIcon,
    color: "white",
    name: 'voting',
    position: 1,
  },
  // {
  //   text: 'Tạo ghi chú',
  //   icon: NoteImage,
  //   name: 'note',
  //   position: 2,
  // },
];
