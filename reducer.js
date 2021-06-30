export const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
            };
        case 'SIGN_IN':
            return {
                ...prevState,
                userToken: action.token,
            };
        case 'SIGN_OUT':
            return {
                ...prevState,
                userToken: null,
            };
    }
};