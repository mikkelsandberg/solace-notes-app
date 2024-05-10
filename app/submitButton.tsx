'use client';

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
    >
      {children}
    </button>
  );
}
