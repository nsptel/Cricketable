import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventsScreen from '../pages/events';
import EventDescriptionScreen from '../pages/eventDescription';
import PrivateEventsScreen from '../pages/privateEvents';

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
            <Stack.Screen
                name="Private Events"
                component={PrivateEventsScreen}
            />
        </Stack.Navigator>
    );
};