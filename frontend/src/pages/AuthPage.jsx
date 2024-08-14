import React from 'react';
import { useRecoilValue } from "recoil";
import SignupBox from '../components/SignUpBox';
import LoginBox from '../components/LoginBox';
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);
	return <>
        {authScreenState === "login" ? <LoginBox /> : <SignupBox />}
    </>;
};

export default AuthPage;
