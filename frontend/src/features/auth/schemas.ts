import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({  
    email: Yup.string()
        .email()
        .required('Email is required!'),
    password: Yup.string()
        .required('Password is required!'),
});

export const SignUpSchema = Yup.object().shape({  
    email: Yup.string()
        .email()
        .required('Email is required!'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Must include at least one lowercase letter')
        .matches(/[A-Z]/, 'Must include at least one uppercase letter')
        .matches(/[0-9]/, 'Must include at least one number')
        .required('Password is required!'),
    fullName: Yup.string()
        .required('Full Name is required!'),
});

export const ConfirmUserSchema = Yup.object().shape({  
    code: Yup.string()
        .length(6, "Code must six digits long!")
        .required('Confirmation code is required!'),
});
