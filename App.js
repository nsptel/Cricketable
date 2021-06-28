import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './assets/stacks/AuthStack';
import MainStack from './assets/stacks/MainStack';
import { authReducer } from './reducer';
import AuthContext from './context';

const App = () => {
  const [state, dispatch] = React.useReducer(authReducer, { userToken: null });

  const providerState = {
    state,
    dispatch
  }

  React.useEffect(() => {
    const getTokenAsync = async () => {
      try {
        let userToken = await AsyncStorage.getItem('user');
        if (userToken) {
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        }
      } catch (err) {
        console.log(err);
      }
    }
    getTokenAsync();
  });

  return (
    <AuthContext.Provider value={providerState}>
      <NavigationContainer>
        {state.userToken ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
