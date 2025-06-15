
import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, MailCheck } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;
    setError('');
    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred during sign up.');
    }
  };

  const onVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // Use a hard redirect to ensure the auth state is correctly loaded on the next page.
        // This prevents race conditions with React Router.
        window.location.href = '/';
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid verification code.');
    }
  };

  if (pendingVerification) {
    return (
      <div className="text-center space-y-4">
        <MailCheck className="mx-auto h-12 w-12 text-primary" />
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-muted-foreground text-sm">We've sent a verification code to your email address.</p>
        <form onSubmit={onVerify} className="space-y-4">
          <Input name="code" placeholder="Enter verification code" className="h-11 bg-background/80 text-center" />
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg">Verify Email</Button>
        </form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} className="h-11 bg-background/80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="h-11 bg-background/80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
