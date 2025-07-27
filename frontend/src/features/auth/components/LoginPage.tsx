import { useFormik } from 'formik';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginSchema } from "@/features/auth/schemas";
import { loginUserApi } from '@/features/auth/api';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router';
import { toast } from 'sonner';
import TokenService from '@/lib/token-service';
import { UserNotConfirmedException } from '@aws-sdk/client-cognito-identity-provider';
import { useContext } from 'react';
import AuthContext from '@/components/shared/AuthContext';

function LoginPage() {
    const auth = useContext(AuthContext);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        onSubmit: (values) => loginUserMutation.mutate({ 
            email: values.email, 
            password: values.password,
        }),
        validationSchema: LoginSchema
    });

    const loginUserMutation = useMutation({
        mutationFn: loginUserApi,
        onSuccess: (response) => {
            toast.success("Logged in successfuly");
            const tokenService = TokenService.getInstance();
            // Setting the tokens will automatically re-route the user to dashboard.
            // setTokens -> Fires AppAuthStateChangeEvent -> Captured by <AuthPage />
            tokenService.setTokens(response.accessToken, response.refreshToken);
            formik.setSubmitting(false);
        },
        onError: (error) => {
            if (error instanceof UserNotConfirmedException) {
                auth.setAuth({
                    verificationRequired: true,
                    verificationEmail: formik.values.email,
                    isAuthenticated: true,
                    loading: false,
                    user: null
                });
            } else {
                toast.error("Error", {
                    description: error.message,
                });
            }
            formik.setSubmitting(false);
        }
    });

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="w-full max-w-sm" onSubmit={formik.handleSubmit}>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>Enter your email below to login to your account.</CardDescription>
                        <CardAction>
                        <Link to="/signup">
                            <Button>Sign Up</Button>
                        </Link>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors && formik.errors.email}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >Forgot your password?</a>
                                </div>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors && formik.errors.password}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button disabled={formik.isSubmitting} type="submit" className="w-full">Login</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

export default LoginPage;
