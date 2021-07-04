export const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                userToken: action.userToken,
                userData: action.userData,
                isLoading: false,
            };
        case 'SIGN_IN':
            
            return {
                ...prevState,
                userToken: action.userToken,
                userData: action.userData,
                userGuide: action.userGuide,
            };
        case 'SIGN_OUT':
            return {
                ...prevState,
                userToken: action.userToken,
                userData: action.userData,
            };
    }
};