import {
  QueryClient,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GroupModel } from "~/models/group";

const PAGE_SIZE = 25;

