import * as React from 'react';
import { Text, Pressable, ScrollView, View, Image } from 'react-native';

const { styles } = require('../style');
const db = require('../../db_conn');

export default EventDescriptionScreen = ({ route, navigation }) => {
    const [eventInfo, setEventInfo] = React.useState({
        name: '',
        address: '',
        description: '',
        group: null,
        event_date: null,
        timestamp: null,
        image: ''
    });

    React.useEffect(() => {
        db.collection('event')
            .doc(route.params.eventId)
            .get()
            .then((event) => {
                const data = event.data();
                setEventInfo({
                    name: data.name,
                    address: data.address,
                    description: data.description,
                    group: null,
                    event_date: data.event_date,
                    timestamp: data.timestamp,
                    image: data.image
                });
            });
    }, []);

    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <View>
                    <Image
                        source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/event_pics%2F${eventInfo.image}?alt=media&token=${eventInfo.image}` }}
                    />
                </View>
                <Text>{eventInfo.name}</Text>
                <Text>{eventInfo.description}</Text>
                <Text>{eventInfo.event_date && eventInfo.event_date.toDate().toString()}</Text>
                <Pressable
                    style={styles.button}
                    onPress={() => { navigation.navigate("Events") }}>
                    <Text style={[styles.invertText, styles.text]}>Close</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}