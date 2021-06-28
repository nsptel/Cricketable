import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './assets/stacks/AuthStack';
import MainStack from './assets/stacks/MainStack';

const App = () => {
  const [user, setUser] = React.useState();
  try {
    AsyncStorage.getItem('user').then(id => setUser(id));
  } catch (err) {
    console.log(err);
  }

  return (
    <NavigationContainer>
      { user ? <MainStack /> : <AuthStack /> }
    </NavigationContainer>
  );
};

export default App;
