'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z, ZodType } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import ROUTES from '@/constants/routes';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: 'SIGN_IN' | 'SIGN_UP';
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    // @ts-expect-error not sure
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast(
        formType === 'SIGN_IN'
          ? 'Signed in successfully'
          : 'Signed up successfully',
        {
          classNames: {
            toast: 'toast-success',
          },
        }
      );

      router.push(ROUTES.HOME);
    } else {
      toast(result?.error?.message || 'An error occurred', {
        classNames: {
          toast: 'toast-error',
        },
      });
    }
  };

  const buttonText = formType === 'SIGN_IN' ? 'Sign In' : 'Sign Up';

  return (
    <Form {...form}>
      <form
        // @ts-expect-error fix later
        onSubmit={form.handleSubmit(handleSubmit)}
        className='mt-10 space-y-6'
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            // @ts-expect-error not sure
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-2.5'>
                <FormLabel className='paragraph-medium text-dark400_light700'>
                  {field.name === 'email'
                    ? 'Email Address'
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === 'password' ? 'password' : 'text'}
                    {...field}
                    className='paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          className='primary-gradient paragraph-medium rounded-2 font-inter !text-light-900 min-h-12 w-full px-4 py-3'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? buttonText === 'Sign In'
              ? 'Signing In...'
              : 'Signing Up...'
            : buttonText}
        </Button>

        {formType === 'SIGN_IN' ? (
          <p>
            Don&#39;t have an account?{' '}
            <Link
              href={ROUTES.SIGN_UP}
              className='paragraph-semibold primary-text-gradient'
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link
              href={ROUTES.SIGN_IN}
              className='paragraph-semibold primary-text-gradient'
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
