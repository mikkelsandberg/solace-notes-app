import UpsertNoteForm from '@/app/notes/upsertNoteForm';
import { Note } from '@/db/schema/notes';
import { Dialog, Typography } from '@mui/material';

interface UpsertNoteDialogProps {
  note?: Note | null;
  onClose: () => void;
  onUpsertNote: () => void;
  isOpen: boolean;
}

export default function UpsertNoteDialog({ note, onClose, onUpsertNote, isOpen }: UpsertNoteDialogProps) {
  return (
    isOpen
      ? (
        <Dialog open={isOpen} onClose={onClose}>
          <Typography>{note ? 'Edit Note' : 'Add Note'}</Typography>

          <UpsertNoteForm afterSubmit={onUpsertNote} />
        </Dialog>
      )
      : <></>
  );
}