import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GroupsScreen from '../pages/groups';
import GroupDescriptionScreen from '../pages/groupDescription';
import CreateGroupScreen from '../pages/createGroup';
import CreateEventScreen from '../pages/createEvent';

const Stack = createStackNavigator();

export default GroupStack = () => {
    return (
        <Stack.Navigator initialRouteName="Groups">
            <Stack.Screen
                name="Groups"
                options={{headerShown: false}}
                component={GroupsScreen}
            />
            <Stack.Screen
                name="Create Group"
                component={CreateGroupScreen}
            />
            <Stack.Screen
                name="Group Description"
                component={GroupDescriptionScreen}
            />
            <Stack.Screen
                name="Create Event"
                component={CreateEventScreen}
            />
        </Stack.Navigator>
    );
};