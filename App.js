import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const db = require('./db_conn');
import AuthStack from './assets/stacks/AuthStack';
import MainStack from './assets/stacks/MainStack';
import SplashScreen from './assets/pages/loading';
import GuideScreen from './assets/pages/guide';
import { authReducer } from './reducer';
import AuthContext from './context';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(["Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function."]);

const App = () => {
  const [state, dispatch] = React.useReducer(
    authReducer,
    { userToken: null, userGuide: false, isLoading: false, userData: null }
  );

  const providerState = {
    state,
    dispatch
  }

  React.useEffect(() => {
    userId = null;
    const getTokenAsync = async () => {
      try {
        await AsyncStorage.getItem('userId').then(res1 => {
          userId = res1;
          return db.collection('user').doc(String(userId)).get();
        }).then(res2 => {
          dispatch({ type: 'RESTORE_TOKEN', userToken: userId, userData: res2.data() });
        })
      } catch (err) {
        console.log(err);
      }
    }
    getTokenAsync();
  }, []);

  return (
    <AuthContext.Provider value={providerState}>
      <NavigationContainer>
        {state.isLoading ? (
          <SplashScreen />
        ) : state.userGuide ? (
          <GuideScreen />
        ) : (state.userToken === null) ? (
          <AuthStack />
        ) : (
          <MainStack />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
