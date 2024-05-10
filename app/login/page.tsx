import { LoginForm } from "@/app/loginForm";
import { SubmitButton } from "@/app/submitButton";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export default function Login() {
  return (
    <LoginForm
      action={async (formData: FormData) => {
        'use server';
        
        const result = await signIn('credentials', {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          redirect: false,
        });

        console.log('result', result);

        if (result) {
          redirect('/notes');
        } else {
          console.log('Sign in failed');
          return;
        }
      }}
    >
      <SubmitButton>Sign in</SubmitButton>
    </LoginForm>
  );
}