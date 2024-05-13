import UpsertNoteForm from '@/app/notes/upsertNoteForm';
import { Note } from '@/db/schema/notes';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

interface UpsertNoteDialogProps {
  note?: Note | null;
  handleClose: () => void;
  handleUpsertNote: () => void;
  handleDeleteNote?: (id: number) => void;
  isOpen: boolean;
}

export default function UpsertNoteDialog({ note, handleClose, handleUpsertNote, handleDeleteNote, isOpen}: UpsertNoteDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>
        {note ? 'Edit Note' : 'Add Note'}
      </DialogTitle>

      <DialogContent>
        <UpsertNoteForm
          note={note}
          disabled={!isOpen}
          afterSubmit={handleUpsertNote}
        />

        {
          handleDeleteNote && note?.id && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => {
                handleDeleteNote(note.id);
                handleClose();
              }}>Delete Note</Button>
          )
        }
      </DialogContent>
    </Dialog>
  );
}