import * as React from 'react';
import { Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { styles } = require('../style');

export default GroupDescriptionScreen = () => {
    const navigation = useNavigation();

    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate("Create Event")}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>
                        Create Event
                    </Text>
                </TouchableOpacity>
                <Text>This is the description of the group.</Text>
            </View>
        </ScrollView>
    )
}