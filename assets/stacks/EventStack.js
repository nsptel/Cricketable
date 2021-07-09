import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventsScreen from '../pages/events';
import CreateEventScreen from '../pages/createEvent';

const Stack = createStackNavigator();

export default EventStack = () => {
    return (
        <Stack.Navigator initialRouteName="Event">
            <Stack.Screen
                name="Events"
                options={{headerShown: false}}
                component={EventsScreen}
            />
            <Stack.Screen
                name="Create Event"
                component={CreateEventScreen}
            />
        </Stack.Navigator>
    );
};