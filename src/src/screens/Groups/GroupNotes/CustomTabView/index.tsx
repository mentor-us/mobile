import { TabType } from "../index.props";
import VoteTabView from "./VoteTabView";

interface Props {
  groupId: string;
  type: TabType;
}

export default function CustomTabView({ groupId, type }: Props) {
  switch (type) {
    case "voting":
      return <VoteTabView groupId={groupId} type={type} />;
    case "pin":
      return null;
    case "note":
      return null;
  }

  return null;
}
