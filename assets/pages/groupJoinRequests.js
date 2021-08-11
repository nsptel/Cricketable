import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const styles = require('../style');

const Request = (props) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', width: '90%', marginHorizontal: '5%', marginVertical: 10, justifyContent: 'space-between' }}>
            <View style={{ flex: 1, alignSelf: 'center', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 18 }}>{ props.name }</Text>
                <Text style={styles.smallText}>{ props.email }</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 18, borderWidth: 1, padding: 8, borderRadius: 24, borderColor: 'green', marginRight: 10 }}><Ionicons name="ios-checkmark" size={28} color="green" /></Text>
                <Text style={[styles.smallText, { borderWidth: 1, padding: 8, borderRadius: 24, borderColor: 'red' }]}><Ionicons name="ios-close" size={28} color="red" /></Text>
            </View>
        </View>
    )
}

export default GroupJoinRequestsScreen = ({ route, navigation }) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Request name='Nilkumar Patel' email='nsp4898@gmail.com' />
                <Request name='Chintan Trivedi' email='chintan024@gmail.com' />
                <Request name='Chaitali Rahol' email='raholchaitali20@gmail.com' />
            </View>
        </ScrollView>
    )
}