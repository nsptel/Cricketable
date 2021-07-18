import React from 'react';
import { Image } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileStack from './ProfileStack';
import firebase from 'firebase';
import AuthContext from '../../context';
import EventStack from './EventStack';
import GroupStack from './GroupStack';

const HomeScreen = require('../pages/home');
const { profileStyles } = require('../style');
const Tab = createMaterialBottomTabNavigator();
const accentColor = '#3107cb';

const MainStack = () => {
  const [profilePicURL, setProfilePicURL] = React.useState('');
  const { state, dispatch } = React.useContext(AuthContext);

  firebase.storage()
      .ref(state.userData.profile_pic)
      .getDownloadURL()
      .then((url) => setProfilePicURL(url));

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
          if (route.name === 'Profile') {
            // iconName = focused ? 'ios-person' : 'ios-person-outline';
            return <Image style={[profileStyles.avatar, profileStyles.smallAvatar]}
              source={(profilePicURL !== '') ? { uri: profilePicURL } : null} />
          }
          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Groups') {
            iconName = focused ? 'ios-people' : 'ios-people-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'ios-tennisball' : 'ios-tennisball-outline';
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
        component={GroupStack}
      />
      <Tab.Screen
        name="Events"
        component={EventStack}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

module.exports = MainStack;