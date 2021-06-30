import React from 'react';
import { View, Text } from 'react-native';

const { styles } = require('../style');

export default HeaderComponent = () => {
    return (
        <View style={styles.headerTab}>
            <Text style={styles.headerTitle}>Cricketable</Text>
        </View>
    )
}