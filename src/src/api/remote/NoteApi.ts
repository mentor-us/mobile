import { PaginationData } from "~/models/commonTypes";
import axiosClient from "./AxiosClient";
import {
  CreateNoteDto,
  Note,
  NoteDetail,
  NoteUserProfile,
} from "~/models/note";

const NoteApi = {
  /**
   * Get a list of user that has been noted by me
   */
  getNotedUsers: (
    query: string,
    page = 0,
    pageSize = 25,
  ): Promise<NoteUserProfile[]> => {
    return axiosClient.get("/api/notes/users", {
      params: { query, page, pageSize },
    });
  },

  getAllNoteOfUser: (
    userId: string,
    params: {
      search: string;
      page: number;
      pageSize: number;
    },
  ): Promise<PaginationData<Note>> => {
    return axiosClient.get(`/api/notes/user/${userId}`, { params });
  },

  /**
   * Create a note
   */
  createNote: (createNoteDto: CreateNoteDto): Promise<NoteDetail> => {
    return axiosClient.post("/api/notes", createNoteDto);
  },
  updateNote: () => {},
  deleteNote: () => {},
  getNoteDetail: (nodeId: string): Promise<NoteDetail> => {
    return axiosClient.get(`/api/notes/${nodeId}`);
  },
};

export default NoteApi;
