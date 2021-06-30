import * as React from 'react';
import { Text, ScrollView, View } from 'react-native';

const { styles } = require('../style');

export default SplashScreen = () => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={[styles.normalText, styles.text]}>Cricketable</Text>
            </View>
        </ScrollView>
    );
}
