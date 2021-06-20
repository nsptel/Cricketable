import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'

const { SignUpScreen, LoginScreen } = require('./assets/pages/auth');
const HomeScreen = require('./assets/pages/home');
const GroupsScreen = require('./assets/pages/groups');
const EventsScreen = require('./assets/pages/events');
const ProfileScreen = require('./assets/pages/profile');

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const App = () => {
  let user = true;
  return user ? (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        labeled="true"
        shifting={false}
        activeColor="white"
        inactiveColor="#cf9af5"
        barStyle={{ backgroundColor: 'purple' }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, _ }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-home'
                : 'ios-home-outline';
            } else if (route.name === 'Groups') {
              iconName = focused ? 'ios-people' : 'ios-people-outline';
            } else if (route.name === 'Events') {
              iconName = focused ? 'ios-tennisball' : 'ios-tennisball-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'ios-person' : 'ios-person-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={18} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Groups"
          component={GroupsScreen}
        />
        <Tab.Screen
          name="Events"
          component={EventsScreen}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
};

export default App;
