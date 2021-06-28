import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

const HomeScreen = require('../pages/home');
const GroupsScreen = require('../pages/groups');
const EventsScreen = require('../pages/events');
const ProfileScreen = require('../pages/profile');
const Tab = createMaterialBottomTabNavigator();
const accentColor = 'purple';

const MainStack = () => {
    return (
        <Tab.Navigator
          initialRouteName="Home"
          labeled="true"
          shifting={false}
          activeColor="white"
          inactiveColor="#cf9af5"
          barStyle={{ backgroundColor: accentColor }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, _ }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'ios-home' : 'ios-home-outline';
              } else if (route.name === 'Groups') {
                iconName = focused ? 'ios-people' : 'ios-people-outline';
              } else if (route.name === 'Events') {
                iconName = focused ? 'ios-tennisball' : 'ios-tennisball-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'ios-person' : 'ios-person-outline';
              }
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
    );
};

module.exports = MainStack;