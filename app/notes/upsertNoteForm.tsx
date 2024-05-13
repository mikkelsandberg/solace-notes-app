'use client';

import { useLoggedInUser } from '@/app/hooks/authHooks';
import { getNormalizedCharacterCount } from '@/app/utils/notesUtils';
import { createNoteForUser, Note, updateNoteById } from '@/db/schema/notes';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Yup from 'yup';

interface UpsertNoteFormProps {
  note?: Note | null;
  disabled: boolean;
  afterSubmit: () => void;
}

interface UpsertNoteFormValues {
  content: string;
}

export default function UpsertNoteForm({ note, disabled, afterSubmit }: UpsertNoteFormProps) {
  const { user } = useLoggedInUser();
  const [submittingForm, setSubmittingForm] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const reactQuillRef = useRef<ReactQuill>(null);

  const validationSchema = Yup.object().shape({
    content: Yup.string().required('Content is required'),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const { handleSubmit, getValues, setValue } = useForm({
    ...formOptions,
    mode: 'onBlur',
    defaultValues: {
      content: note?.content || '',
    }
  });

  const onSubmit = async (formValues: UpsertNoteFormValues) => {
    setSubmittingForm(true);

    const userId = user?.id;

    if (!userId) {
      setSubmittingForm(false);
      setError('There was an error saving the note. Please try again.');
      return;
    }

    if (note) {
      await updateNoteById(note.id, formValues.content);
    } else {
      await createNoteForUser(userId, formValues.content);
      setValue('content', '');
      setCharacterCount(0);
    }

    afterSubmit();
    setSubmittingForm(false);
  };

  useEffect(() => {
    if (note) {
      setCharacterCount(getNormalizedCharacterCount(note.content));
    }
  }, [note]);

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        value={getValues('content')}
        placeholder="Enter your note here..."
        onChange={(content) => {
          setValue('content', content);
          setCharacterCount(getNormalizedCharacterCount(content));
        }}
      />

      <Typography variant="caption" color="GrayText">{characterCount} / 300</Typography>

      <Box>
        <Typography variant="caption" color="GrayText">* Note must be at least 20 characters long.</Typography>
      </Box>

      <Button
        disabled={disabled || submittingForm}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        {note ? 'Edit Note' : 'Add Note'}
      </Button>
    </form>
  );
}