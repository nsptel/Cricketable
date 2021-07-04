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



const App = () => {
  const [state, dispatch] = React.useReducer(
    authReducer,
    { userToken: null, userGuide: false, isLoading: true, userData: null }
  );

  const providerState = {
    state,
    dispatch
  }
  
  React.useEffect(() => {
    const getTokenAsync = async () => {
      var userToken1;
      // await AsyncStorage.clear();
      try {
        await AsyncStorage.getItem('userId').then(res1 => {  
          userToken1 = res1;
          console.log(userToken1);
          return db.collection('user').doc(String(userToken1)).get();
        }).then(res2 => {
          dispatch({ type: 'RESTORE_TOKEN', userToken: userToken1, userData: res2.data() });
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
        ) : state.userGuide ? (
          <GuideScreen /> 
        ) : state.userToken === null ? (
          <AuthStack />
        ) : (
          <MainStack />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
