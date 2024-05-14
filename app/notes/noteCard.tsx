import UpsertNoteDialog from '@/app/notes/upsertNoteDialog';
import { deleteNoteById, Note } from '@/db/schema/notes';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

interface NoteCardProps {
  note: Note;
  onNoteDelete: () => void;
  onUpsertNote: () => void;
}

export default function NoteCard({ note, onNoteDelete, onUpsertNote }: NoteCardProps) {
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);

  const deleteNote = async (id: number) => {
    await deleteNoteById(id);
    onNoteDelete();
  };

  const editNote = (note: Note) => {
    setNoteToEdit(note);
    setEditNoteDialogOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 240,
        }}
      >
        <CardContent
          sx={{
            maxHeight: '100%',
            overflow: 'auto',
          }}
        >
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </CardContent>

        <CardActions sx={{
          justifyContent: 'flex-end',
        }}>
          <IconButton onClick={() => editNote(note)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteNote(note.id)}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      <UpsertNoteDialog
        note={noteToEdit}
        handleClose={() => setEditNoteDialogOpen(false)}
        handleUpsertNote={onUpsertNote}
        handleDeleteNote={deleteNote}
        isOpen={editNoteDialogOpen}
      />
    </>
  );
}