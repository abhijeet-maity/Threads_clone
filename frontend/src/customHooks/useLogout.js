import React from 'react';
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePopToast from "../customHooks/usePopToast";


const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
	const popToast = usePopToast();

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				popToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);
		} catch (error) {
			popToast("Error", error, "error");
		}
	};
 
    return handleLogout;
}

export default useLogout
