import { Button } from "@chakra-ui/button";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePopToast from "../customHooks/usePopToast";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../customHooks/useLogout";



const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const logout = useLogout();
	const popToast = usePopToast();

	
	return (
		<Button position={"relative"} top={"0px"} right={"0px"} ml={0} size={"sm"} onClick={logout}>
			<FiLogOut size={12} />
			{/* Logout */}
		</Button>
	);
};

export default LogoutButton;