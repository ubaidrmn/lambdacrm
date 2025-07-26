import { useNavigate } from 'react-router';
import { useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { Button } from "@/components/ui/button"
import {
  Card,
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
import { confirmUserApi } from '@/features/auth/api';
import { ConfirmUserSchema } from "@/features/auth/schemas";
import { toast } from "sonner"

function ConfirmUserPage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.auth.user) {
            navigate("/signup")
        }
        if (auth.auth.user?.verified) {
            navigate("/dashboard")
        }
    }, [auth.auth.user]);

    const formik = useFormik({
        initialValues: { code: '' },
        onSubmit: (values) => {
            if (auth.auth.user) {
                confirmUserMutation.mutate({ 
                    code: values.code,
                    email: auth.auth.user.email
                })
            } else {
                toast.error("Error", {
                    description: "Something went wrong"
                })
            }
        },
        validationSchema: ConfirmUserSchema
    });

    const confirmUserMutation = useMutation({
        mutationFn: confirmUserApi,
        onSuccess: () => {
            toast.success("Account created successfuly!", {
                description: "Login to start using LambdaCRM."
            });
            formik.setSubmitting(false);
            navigate("/login");
        },
        onError: (error) => {
            formik.setSubmitting(false);
            toast.error("Error", {
                description: error.message,
            });
        }
    });

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="w-full max-w-sm" onSubmit={formik.handleSubmit}>
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Confirm Account</CardTitle>
                        <CardDescription>Enter the verification code we sent below to finish signing up.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Code</Label>
                                <Input
                                    type="text"
                                    name="code"
                                    placeholder="123456"
                                    value={formik.values.code}
                                    onChange={formik.handleChange}
                                />
                                {formik.errors && <p>{formik.errors.code}</p>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button disabled={formik.isSubmitting} type="submit" className="w-full">Verify</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

export default ConfirmUserPage;
