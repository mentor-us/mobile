import { useMutation } from "@tanstack/react-query";
import { CreateNoteDto, NoteDetail } from "~/models/note";
import NoteService from "~/services/note";

export const useCreateNoteMutation = () =>
  useMutation<NoteDetail, Error, CreateNoteDto>({
    mutationKey: "createNote",
    mutationFn: async (createNoteDto: CreateNoteDto) => {
      return await NoteService.createNote(createNoteDto);
    },
  });
