import { signOut } from "../auth";

export default function Notes() {
  return (
    <>
      <h1>Notes</h1>
      <form action={async () => {
        'use server';
        
        await signOut({
          redirectTo: '/login',
        });
      }}>
        <button type="submit">Sign out</button>
      </form>
    </>
  );
}