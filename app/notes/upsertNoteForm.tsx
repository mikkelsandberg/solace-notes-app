import { useLoggedInUser } from '@/app/hooks/authHooks';
import { getNormalizedCharacterCount, MAX_NOTE_CHARACTER_COUNT, MIN_NOTE_CHARACTER_COUNT } from '@/app/utils/notesUtils';
import { createNoteForUser, Note, updateNoteById } from '@/db/schema/notes';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Skeleton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const QuillEditor = useMemo(() => dynamic(() => import('@/app/notes/quillEditor'), {
    loading: () => (
      <Skeleton variant="rectangular" height={90} />
    ), ssr: false
  }), []);

  const { user } = useLoggedInUser();
  const [submittingForm, setSubmittingForm] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const characterCountInvalid = useMemo(() => characterCount < MIN_NOTE_CHARACTER_COUNT || characterCount > MAX_NOTE_CHARACTER_COUNT, [characterCount]);

  const checkIfError = useCallback(() => {
    if (characterCountInvalid) {
      if (characterCount < MIN_NOTE_CHARACTER_COUNT) {
        setError(`Note must be at least ${MIN_NOTE_CHARACTER_COUNT} characters long.`);
      } else {
        setError(`Note must be less than ${MAX_NOTE_CHARACTER_COUNT} characters long.`);
      }
    }
  }, [characterCount, characterCountInvalid]);

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
    if (characterCountInvalid) {
      return;
    }

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

  useEffect(() => {
    if (error) {
      checkIfError(); 
    }

    if (!characterCountInvalid) {
      setError(null);
    }
  }, [characterCountInvalid, checkIfError, error]);

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <QuillEditor
        getValues={getValues}
        setCharacterCount={setCharacterCount}
        setValue={setValue}
      />

      <Typography variant="caption" color={characterCount > MAX_NOTE_CHARACTER_COUNT ? 'error' : 'GrayText'}>{characterCount} / {MAX_NOTE_CHARACTER_COUNT}</Typography>

      <Box
        sx={{
          height: 24,
        }}
      >
        {
          error && (
            <Typography variant="caption" color="error">{error}</Typography>
          )
        }
      </Box>

      <Button
        disabled={disabled || submittingForm}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 0 }}
        onMouseEnter={checkIfError}
      >
        {note ? 'Edit Note' : 'Add Note'}
      </Button>
    </form>
  );
}