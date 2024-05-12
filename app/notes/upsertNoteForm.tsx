import { useLoggedInUser } from '@/app/hooks/authHooks';
import { createNoteForUser, Note } from '@/db/schema/notes';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface UpsertNoteFormProps {
  note?: Note | null;
  afterSubmit: () => void;
}

interface UpsertNoteFormValues {
  content: string;
}

export default function UpsertNoteForm({ note, afterSubmit }: UpsertNoteFormProps) {
  const { user } = useLoggedInUser();

  const validationSchema = Yup.object().shape({
    content: Yup.string().min(20).max(300).required('Content is required'),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const { register, handleSubmit, reset } = useForm({
    ...formOptions,
    defaultValues: {
      content: note?.content || '',
    }
  });

  const onSubmit = async (formValues: UpsertNoteFormValues) => {
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not found');
    }

    await createNoteForUser(userId, formValues.content);
    afterSubmit();
    reset({ content: '' });
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('content')}
        margin="normal"
        required
        fullWidth
        id="content"
        label="Note"
        name="content"
        autoFocus
        multiline
        minRows={2}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Add Note
      </Button>
    </form>
  );
}