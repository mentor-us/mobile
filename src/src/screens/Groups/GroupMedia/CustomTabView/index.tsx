import {ShortMedia} from "~/models/media";
import ImageGallery from "../ImageGallery";
import { FileGallery } from "../FileGallery";

interface Props {
  data: ShortMedia[];
  loading: boolean;
  mode: "IMAGE" | "FILE";
  refresh: () => void;
}

export default function CustomTabView({
  data,
  loading = false,
  mode,
  refresh,
}: Props) {
  const _render = () => {
    return mode === "IMAGE" 
    ? <ImageGallery data={data} loading={loading} refresh={refresh}/> 
    : <FileGallery data={data} loading={loading} refresh={refresh}/> ;
  };

  return <_render />;
}
