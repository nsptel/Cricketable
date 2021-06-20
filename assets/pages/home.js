import * as React from 'react';
import { TextInput, Text, setState, Pressable, ScrollView, View } from 'react-native';

const { styles } = require('../style');

class HomeScreen extends React.Component {
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={[styles.normalText, styles.text]}>This is the home page!</Text>
                </View>
            </ScrollView>
        );
    }
}

module.exports = HomeScreen;
