import { PaginationData } from "~/models/commonTypes";
import axiosClient from "./AxiosClient";
import {
  CreateOrUpdateNoteDto,
  Note,
  NoteDetail,
  NoteUserProfile,
  ShareNoteRequest,
} from "~/models/note";

const NoteApi = {
  /**
   * Get a list of user that has been noted by me
   */
  getNotedUsers: (
    search: string,
    page = 0,
    pageSize = 25,
  ): Promise<NoteUserProfile[]> => {
    return axiosClient.get("/api/notes/users", {
      params: { search, page, pageSize },
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
  createNote: (createNoteDto: CreateOrUpdateNoteDto): Promise<NoteDetail> => {
    return axiosClient.post("/api/notes", createNoteDto);
  },

  /*
   * Update a note
   */
  updateNote: (
    noteId: string,
    updateNoteDto: CreateOrUpdateNoteDto,
  ): Promise<NoteDetail> => {
    return axiosClient.patch(`/api/notes/${noteId}`, updateNoteDto);
  },

  /*
   * Delete note
   */
  deleteNote: (nodeId: string) => {
    return axiosClient.delete(`/api/notes/${nodeId}`);
  },

  /*
   * Get detail of a note
   */
  getNoteDetail: (nodeId: string): Promise<NoteDetail> => {
    return axiosClient.get(`/api/notes/${nodeId}`);
  },

  /**
   * Share a note
   */
  shareNote: (noteId: string, shareNoteRequest: ShareNoteRequest) => {
    return axiosClient.post(`/api/notes/${noteId}/share`, shareNoteRequest);
  },
};

export default NoteApi;
