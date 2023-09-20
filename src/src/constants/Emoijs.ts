import Emojis from "~/assets/emoijs";

const EmoijsData = {
  LIKE: {source: Emojis.LikeEmoji},
  LOVE_EYE: {source: Emojis.LoveEyeEmoji},
  SMILE: {source: Emojis.SmileEmoji},
  CRY_FACE: {source: Emojis.CryFaceEmoji},
  CURIOUS: {source: Emojis.CuriousEmoji},
  ANGRY_FACE: {source: Emojis.AngryFaceEmoji},
};

export type EmoijType =
  | "LIKE"
  | "LOVE_EYE"
  | "SMILE"
  | "CRY_FACE"
  | "CURIOUS"
  | "ANGRY_FACE";

export interface EmojiModel {
  id: EmoijType;
  total: number;
}

export interface TotalReaction {
  data: EmojiModel[];
  ownerReacted: EmojiModel[];
  total: number;
}

export const TOTAL_REACTION_MOCK: TotalReaction = {
  data: [
    {id: "SMILE", total: 5},
    {id: "LIKE", total: 3},
    {id: "LOVE_EYE", total: 3},
    {id: "CURIOUS", total: 3},
  ],
  ownerReacted: [
    {
      id: "ANGRY_FACE",
      total: 2,
    },
    {
      id: "SMILE",
      total: 1,
    },
  ],
  total: 8,
};

export const INIT_TOTAL_REACTION: TotalReaction = {
  data: [],
  ownerReacted: [],
  total: 0,
};

export default EmoijsData;
