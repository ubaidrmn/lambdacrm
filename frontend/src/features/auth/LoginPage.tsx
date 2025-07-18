import { useState } from "react"
import { InitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import { ErrorMessage, Field, Form, Formik } from 'formik';
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
import { LoginSchema } from "./schemas";

function LoginPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(false);
                }}
            >
                {(formProps) => (
                    <Form className="w-full max-w-sm">
                        <Card className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle>Login to your account</CardTitle>
                                <CardDescription>Enter your email below to login to your account.</CardDescription>
                                <CardAction>
                                <Button variant="link">Sign Up</Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                        <Field name="email">
                                            {() => (
                                                <>
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        placeholder="m@example.com"
                                                        value={formProps.values.email}
                                                        onChange={formProps.handleChange}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                        <ErrorMessage name="email" component="div" />
                                        </div>
                                        <div className="grid gap-2">
                                        <Field name="password">
                                            {() => (
                                                <>
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
                                                        value={formProps.values.password}
                                                        onChange={formProps.handleChange}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                        <ErrorMessage name="password" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button onClick={() => formProps.handleSubmit()} disabled={formProps.isSubmitting} type="submit" className="w-full">Login</Button>
                            </CardFooter>
                        </Card>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default LoginPage;
