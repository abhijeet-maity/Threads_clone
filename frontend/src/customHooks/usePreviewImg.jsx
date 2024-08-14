import { useState } from "react";
import usePopToast from "./usePopToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const popToast = usePopToast();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
        // console.log(file);
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file);
		} else {
			popToast("Invalid file type", " Please select an image file", "error");
			setImgUrl(null);
		}
	};
    // console.log(imgUrl);
	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;

//