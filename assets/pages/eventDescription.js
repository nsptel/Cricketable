import * as React from 'react';
import { TextInput, Text, Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { styles } = require('../style');

export default EventDescriptionScreen = () => {
    return (
        <ScrollView>
            <View style={styles.container}>
  
                <View>
                    <Text>Image here</Text>
                </View>
                
                <Text> Evnet Descriptin with all the data here</Text>
                <Text> Group Information with events organized</Text>
                <Text> Fake data of statistics </Text>
                <Pressable
                    
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Close(Not Working)</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}