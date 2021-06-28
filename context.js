import React from 'react';

const AuthContext = React.createContext();

export function useAuthContext() {
  return React.useContext(AuthContext);
}

export default AuthContext;