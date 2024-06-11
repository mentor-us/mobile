import { VoteDetail } from "~/models/vote";
import axiosClient from "./AxiosClient";
import { AxiosResponse } from "axios";
import { CreateNoteDto } from "~/models/note";

const NoteApi = {
  /**
   * Get a list of user that has been noted by me
   */
  getNotedUsers: () => {},
  /**
   * Create a note
   */
  createNote: (noteDto: CreateNoteDto) => {},
  updateNote: (noteDto: UpdateNoteDtoNoteDto) => {},
  deleteNote: () => {},
  getNote: () => {},
  getNotes: () => {},
};

export default NoteApi;
