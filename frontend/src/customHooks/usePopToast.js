import { useToast } from "@chakra-ui/toast";
import { useCallback } from "react";

const usePopToast = () => {
	const toast = useToast();

	const popToast = useCallback(
		(title, description, status) => {
			toast({
				title,
				description,
				status,
				duration: 2000,
				isClosable: true,
			});
		},
		[toast]
	);

	return popToast;
};

export default usePopToast;