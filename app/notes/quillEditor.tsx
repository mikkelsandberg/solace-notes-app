import '@/app/notes/quillEditor.scss';
import { getNormalizedCharacterCount } from '@/app/utils/notesUtils';
import { useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  setCharacterCount: (count: number) => void;
  getValues: (key: string) => string;
  setValue: UseFormSetValue<{ content: string; }>;
}

export default function QuillEditor({ getValues, setCharacterCount, setValue }: QuillEditorProps) {
  const reactQuillRef = useRef<ReactQuill>(null);

  return (
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
  );
}