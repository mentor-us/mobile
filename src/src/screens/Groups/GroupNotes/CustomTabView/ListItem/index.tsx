import React from "react";
import {TabType} from "../../index.props";
import Voting from "./Voting";
import Pin from "./Pin";
import Note from "./Note";
import { VoteDetail } from "~/models/vote";

interface Props {
  type: TabType;
  item: VoteDetail;
}

const ListItem = ({type = "voting", item}: Props) => {
  switch (type) {
    case "voting":
      return <Voting item={item} />;
    case "pin":
      return <Pin />;
    case "note":
      return <Note />;
    default:
      return <></>;
  }
};

export default ListItem;
