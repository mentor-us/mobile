import NoteApi from "~/api/remote/NoteApi";
import { PaginationData } from "~/models/commonTypes";
import {
  CreateNoteDto,
  Note,
  NoteDetail,
  NoteUserProfile,
} from "~/models/note";
import TryCatchWrapper from "~/utils/TryCatchWrapper";

const NoteService = {
  async createNote(createNoteDto: CreateNoteDto): Promise<NoteDetail> {
    return await NoteApi.createNote(createNoteDto);
  },

  async findNotedUsers(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<NoteUserProfile[]> {
    return await NoteApi.getNotedUsers(query, page, pageSize);
  },

  async getNoteDetail(noteId: string): Promise<NoteDetail> {
    return await NoteApi.getNoteDetail(noteId);
  },

  async getAllNoteOfUser(
    userId: string,
    params: {
      search: string;
      page: number;
      pageSize: number;
    },
  ): Promise<PaginationData<Note>> {
    return await NoteApi.getAllNoteOfUser(userId, params);
  },
};

export default TryCatchWrapper(NoteService, "NoteService");
