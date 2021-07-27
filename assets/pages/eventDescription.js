import * as React from 'react';
import { Text, Pressable, ScrollView, View, Image } from 'react-native';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import AuthContext from '../../context';

const { styles, profileStyles } = require('../style');
const db = require('../../db_conn');

export default EventDescriptionScreen = ({ route, navigation }) => {
    const eventId = route.params.eventId;
    const { state, dispatch } = React.useContext(AuthContext);
    const [participation, setParticipation] = React.useState('');
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
            .doc(eventId)
            .get()
            .then((event) => {
                const data = event.data();
                setEventInfo({
                    name: data.name,
                    address: data.address,
                    description: data.description,
                    group: data.group.id,
                    event_date: data.event_date,
                    timestamp: data.timestamp,
                    image: data.image
                });
            });

        db.collection('attendees')
            .where('userId', '==', state.userToken)
            .where('eventId', '==', eventId)
            .get()
            .then((snap) => {
                if (snap.docs.length > 0) {
                    setParticipation(snap.docs[0].id);
                }
            });
    }, []);

    const participate = async () => {
        db.collection('attendees')
            .add({
                userId: state.userToken,
                eventId: eventId
            }).then((doc) => {
                setParticipation(doc.id);
            });
    }

    const cancelParticipate = async () => {
        db.collection('attendees')
            .doc(participation)
            .delete()
            .then(() => {
                setParticipation('');
            })
    }

    const getFormattedDate = (d) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (${days[d.getDay()]})`;
    }

    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <Image
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/event_pics%2F${eventId}?alt=media&token=${eventId}` }}
                    style={[profileStyles.avatar, profileStyles.bigAvatar]}
                />
                <Text style={{ fontSize: 24 }}>{eventInfo.name}</Text>
                <Text style={styles.subtitle}>{eventInfo.description}</Text>
                <Text style={styles.subtitle}>This event is organized at {eventInfo.address} on {eventInfo.event_date && getFormattedDate(eventInfo.event_date.toDate())}.</Text>
                <Pressable
                    style={styles.invertButton}
                    onPress={() => {
                        navigation.navigate("Groups",
                            { screen: "Group Description", params: { groupId: eventInfo.group } })
                    }}>
                    <Text style={styles.text}>View Related Group</Text>
                </Pressable>
                {(participation !== '') ? (
                    <Pressable
                        style={styles.button}
                        onPress={() => cancelParticipate()}>
                        <Text style={[styles.invertText, styles.text]}>Cancel Participation</Text>
                    </Pressable>) : (
                    <Pressable
                        style={styles.button}
                        onPress={() => participate()}>
                        <Text style={[styles.invertText, styles.text]}>Participate</Text>
                    </Pressable>
                )}
                <Pressable
                    style={styles.button}
                    onPress={() => { navigation.navigate("Events") }}>
                    <Text style={[styles.invertText, styles.text]}>Close</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}