import {atom} from 'recoil';

export const conversationsAtom = atom({
    key : 'conversationsAtom',
    default: [],
});

export const selectedChatAtom = atom({
    key : 'selectedChatAtom',
    default: {
        _id : "",
        userId : "",
        username : "",
        userProfilePic : "",
    },
});