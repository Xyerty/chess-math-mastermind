
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;
    setError('');
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // Use a hard redirect to ensure the auth state is correctly loaded on the next page.
        // This prevents race conditions with React Router.
        window.location.href = '/';
      } else {
        console.error(result);
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err: any)
{
      setError(err.errors?.[0]?.message || 'Invalid email or password.');
    }
  };

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
          Sign In
        </Button>
      </form>
    </Form>
  );
}
