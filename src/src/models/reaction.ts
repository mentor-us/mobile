import {EmojiModel} from "~/constants/Emoijs";
import {ShortProfileUserModel} from "./user";

export interface Reaction extends ShortProfileUserModel {
  data: EmojiModel[];
  total: number;
  userId: string;
}

// example: {}
export const MOCK_REACTION: Reaction[] = [
  {
    id: "134",
    userId: "123e",
    imageUrl:
      "https://img.buzzfeed.com/buzzfeed-static/static/2019-01/22/19/asset/buzzfeed-prod-web-06/sub-buzz-4482-1548204131-2.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto",
    name: "Pitbull",
    data: [
      {id: "LIKE", total: 1},
      {id: "LOVE_EYE", total: 2},
    ],
    total: 3,
  },
  {
    id: "134",
    userId: "1da23e",
    imageUrl:
      "https://www.dogster.com/wp-content/uploads/2015/05/doberman-puppies-10.jpg.optimal.jpg",
    name: "Doberman",
    data: [
      {id: "LIKE", total: 1},
      {id: "LOVE_EYE", total: 2},
      {id: "SMILE", total: 5},
    ],
    total: 8,
  },
];
