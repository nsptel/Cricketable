import * as React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';
import HeaderComponent from './header';
import { useNavigation } from '@react-navigation/native';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import * as firebase from 'firebase';


const { styles } = require('../style');
const db = require('../../db_conn');


export default EventsScreen = () => {

    const navigation = useNavigation();

    const data = async () => {

        var events = await firebase.database().ref('event').once('value',
            function (AllEvents) {
                AllEvents.forEach(
                    function (event) {
                        console.log(event.val());
                        toggleCards(event);
                    }
                );
            });

    }

    const toggleCards = (event) => {
        const catrgories = [];
        // for (let event of listOfEvents) {
        catrgories.push(

            <Card shadow={4} style={{ minWidth: '450', margin: 'auto' }}>
                <CardTitle style={{ height: '250px', background: event.image }}></CardTitle>
                <CardText>
                    {event.name}
                </CardText>
                <CardContent text={event.event_date} />
            </Card>

        )
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <TouchableOpacity onPress={() => navigation.navigate("Create Event")}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>
                        Create Event
                    </Text>
                </TouchableOpacity>


                <Text onPress={(data)}>Click</Text>
            </View>
        </ScrollView>
    );

}


//module.exports = EventsScreen;
