import React, { lazy, Suspense } from 'react';
import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";

// Lazy load components
const SignupBox = lazy(() => import('../components/SignUpBox'));
const LoginBox = lazy(() => import('../components/LoginBox'));

const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);
	return (
        <Suspense fallback={<div>Loading...</div>}>
            {authScreenState === "login" ? <LoginBox /> : <SignupBox />}
        </Suspense>
    );
};

export default AuthPage;
