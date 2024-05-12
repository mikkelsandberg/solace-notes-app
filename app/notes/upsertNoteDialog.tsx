import UpsertNoteForm from '@/app/notes/upsertNoteForm';
import { Note } from '@/db/schema/notes';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

interface UpsertNoteDialogProps {
  note?: Note | null;
  onClose: () => void;
  onUpsertNote: () => void;
  isOpen: boolean;
}

export default function UpsertNoteDialog({ note, onClose, onUpsertNote, isOpen }: UpsertNoteDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {note ? 'Edit Note' : 'Add Note'}
      </DialogTitle>

      <DialogContent>
        <UpsertNoteForm note={note} disabled={!isOpen} afterSubmit={onUpsertNote} />
      </DialogContent>
    </Dialog>
  );
}