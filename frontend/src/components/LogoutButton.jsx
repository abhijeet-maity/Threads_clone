import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePopToast from "../customHooks/usePopToast";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
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
	return (
		<Button position={"relative"} top={"0px"} right={"0px"} ml={0} size={"sm"} onClick={handleLogout}>
			<FiLogOut size={12} />
			{/* Logout */}
		</Button>
	);
};

export default LogoutButton;