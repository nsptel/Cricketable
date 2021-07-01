import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const db = require('./db_conn');
import AuthStack from './assets/stacks/AuthStack';
import MainStack from './assets/stacks/MainStack';
import SplashScreen from './assets/pages/loading';
import { authReducer } from './reducer';
import AuthContext from './context';

const App = () => {
  const [state, dispatch] = React.useReducer(
    authReducer,
    { userToken: null, isLoading: true, userData: null }
  );

  const providerState = {
    state,
    dispatch
  }

  React.useEffect(() => {
    const getTokenAsync = async () => {
      let userToken;
      try {
        // AsyncStorage.getItem('user')
        //   .then(res => {
        //     results.userToken = res;
        //     return db.collection('user').doc(res).get();
        //   }).then(res2 => {
        //     results.userData = res2;
        //   });
        await AsyncStorage.getItem('user').then(res1 => {
          userToken = res1;
          return db.collection('user').doc(userToken).get();
        }).then(res2 => {
          dispatch({ type: 'RESTORE_TOKEN', userToken: userToken, userData: res2.data() });
        })
      } catch (err) {
        console.log(err);
      }
    }
    getTokenAsync();
  });

  return (
    <AuthContext.Provider value={providerState}>
      <NavigationContainer>
        {state.isLoading ? (
          <SplashScreen />
        ) : state.userToken ? (
          <MainStack />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
