import NoteApi from "~/api/remote/NoteApi";
import { PaginationData } from "~/models/commonTypes";
import {
  CreateOrUpdateNoteDto,
  Note,
  NoteDetail,
  NoteUserProfile,
  ShareNoteRequest,
} from "~/models/note";
import TryCatchWrapper from "~/utils/TryCatchWrapper";

const NoteService = {
  async createNote(createNoteDto: CreateOrUpdateNoteDto): Promise<NoteDetail> {
    return await NoteApi.createNote(createNoteDto);
  },

  async updateNote(
    noteId: string,
    updateNoteDto: CreateOrUpdateNoteDto,
  ): Promise<NoteDetail> {
    return await NoteApi.updateNote(noteId, updateNoteDto);
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

  async deleteNote(noteId: string): Promise<void> {
    await NoteApi.deleteNote(noteId);
  },

  async shareNote(
    noteId: string,
    shareNoteRequest: ShareNoteRequest,
  ): Promise<void> {
    await NoteApi.shareNote(noteId, shareNoteRequest);
  },
};

export default TryCatchWrapper(NoteService, "NoteService");
