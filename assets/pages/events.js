import * as React from 'react';
import { Text, ScrollView, View } from 'react-native';
import HeaderComponent from './header';

const { styles } = require('../style');

class EventsScreen extends React.Component {
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <HeaderComponent />
                    <Text style={[styles.normalText, styles.text]}>This is the events page!</Text>
                </View>
            </ScrollView>
        );
    }
}

module.exports = EventsScreen;
