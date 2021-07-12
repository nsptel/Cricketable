import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventsScreen from '../pages/events';
import EventDescriptionScreen from '../pages/eventDescription';

const Stack = createStackNavigator();

export default EventStack = () => {
    return (
        <Stack.Navigator initialRouteName="Events">
            <Stack.Screen
                name="Events"
                options={{headerShown: false}}
                component={EventsScreen}
            />
            <Stack.Screen
                name="Event Description"
                component={EventDescriptionScreen}
            />
        </Stack.Navigator>
    );
};