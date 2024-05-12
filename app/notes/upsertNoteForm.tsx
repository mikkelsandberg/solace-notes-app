import { useLoggedInUser } from '@/app/hooks/authHooks';
import { createNoteForUser, Note, updateNoteById } from '@/db/schema/notes';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
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
  const { user } = useLoggedInUser();
  const [submittingForm, setSubmittingForm] = useState(false);

  const validationSchema = Yup.object().shape({
    content: Yup.string().min(20).max(300).required('Content is required'),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const { register, handleSubmit, reset } = useForm({
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
      throw new Error('User not found');
    }

    if (note) {
      await updateNoteById(note.id, formValues.content);
    } else {
      await createNoteForUser(userId, formValues.content);
    }

    afterSubmit();
    reset({ content: '' });
    setSubmittingForm(false);
  };

  useEffect(() => {
    if (note) {
      reset({ content: note.content });
    }
  }, [note, reset]);

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('content')}
        disabled={disabled || submittingForm}
        margin="normal"
        required
        fullWidth
        id="content"
        label="Note"
        name="content"
        autoFocus
        multiline
        minRows={2}
        maxRows={3}
      />
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