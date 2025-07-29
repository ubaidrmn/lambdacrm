import { Link, useNavigate } from 'react-router';
import { useContext } from 'react';
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
import { useMutation } from '@tanstack/react-query';
import AuthContext from '@/components/shared/AuthContext';
import { registerUserApi } from '@/features/auth/api';
import { SignUpSchema } from "@/features/auth/schemas";
import { toast } from "sonner"

function SignUpPage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { email: '', password: '', fullName: '' },
        onSubmit: (values) => registerUserMutation.mutate({ 
            email: values.email, 
            password: values.password,
            fullName: values.fullName
        }),
        validationSchema: SignUpSchema
    });

    const registerUserMutation = useMutation({
        mutationFn: registerUserApi,
        onSuccess: (userInstance) => {
            toast.success("Confirmation code sent", {
                description: "We've just sent you a confirmation code. Please check your email address.",
            });
            auth.setAuth({
                isAuthenticated: true,
                user: userInstance,
                verificationRequired: true,
                verificationEmail: formik.values.email,
                loading: false
            })
            // auth.setAuth({
            //     isAuthenticated: false,
            //     user: userInstance
            // });
            formik.setSubmitting(false);
            navigate("/signup/confirm")
        },
        onError: (error) => {
            toast.error("Error", {
                description: error.message,
            });
            formik.setSubmitting(false);
        }
    });

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="w-full max-w-sm" onSubmit={formik.handleSubmit}>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Create a new account</CardTitle>
                        <CardDescription>Enter your details below to create an account.</CardDescription>
                        <CardAction>
                        <Link to="/login">
                            <Button>Login</Button>
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
                                {formik.errors && <p>{formik.errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    type="text"
                                    name="fullName"
                                    placeholder='Ubaid Rehman'
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors && <p>{formik.errors.fullName}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder='StrongPassword123!'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors && <p>{formik.errors.password}</p>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button disabled={formik.isSubmitting} type="submit" className="w-full">Create</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

export default SignUpPage;
