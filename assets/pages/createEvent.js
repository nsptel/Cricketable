import * as React from 'react';
import { TextInput, Image, Text, Pressable, ScrollView, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';

const { styles } = require('../style');
const db = require('../../db_conn');

export default CreateEventScreen = ({ route, navigation }) => {

    const [eventName, setEventName] = React.useState('');
    const [eventDescription, setEventDescription] = React.useState('');
    const [date, setDate] = React.useState(new Date());
    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);
    const [dateText, setDateText] = React.useState('Date');
    const [timeText, setTimeText] = React.useState('Time');
    const [address, setAddress] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const [eventPhoto, setEventPhoto] = React.useState(null);

    // date and time methods
    const onDateTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        setDate(currentDate);
        setShow(Platform.OS === 'ios' ? true : false);
        setDateText(`${months[currentDate.getUTCMonth()]} ${currentDate.getUTCDate()}, ${currentDate.getUTCFullYear()}`);
        setTimeText(currentDate.toLocaleTimeString());
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const handleProfilePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.cancelled) {
            setEventPhoto(result.uri);
        }
    };

    const closeCreateEvent = () => {
        navigation.navigate("Groups");
    }

    const validation = () => {
        setErrors([]);
        let result = true;
        let err = [];

        if (eventName.length == 0 || eventDescription.length == 0 || address.length == 0) {
            result = false;
            err.push("One or more fields are empty.");
        }

        if (dateText == "Date" || timeText == "Time") {
            result = false;
            err.push("Please insert proper date and time.");
        }

        setErrors(err);
        return result;
    }

    const createEvent = async () => {
        if (validation()) {
            await db.collection('event')
                .add({
                    name: eventName,
                    description: eventDescription,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    image: eventPhoto === '/event_pics/sample.png' ? eventPhoto : 'id',
                    group: db.doc('group/' + route.params.groupId),
                    address: address,
                    event_date: firebase.firestore.Timestamp.fromDate(date)
                }).then(async (doc) => {
                    if (eventPhoto !== '/event_pics/sample.png') {
                        const imageResponse = await fetch(eventPhoto);
                        const blob = await imageResponse.blob();

                        let ref = firebase.storage().ref('/event_pics').child(doc.id);
                        ref.put(blob, {
                            metadata: {
                                metadata: {
                                    firebaseStorageDownloadTokens: doc.id
                                }
                            }
                        });
                    }
                    navigation.navigate("Groups");
                });
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>

                {(errors.length > 0) ?
                    <View style={styles.errorBlock}>
                        {errors.map(el => (<Text style={styles.error} key={el}>{el}</Text>))}
                    </View>
                    : null}
                <TextInput
                    style={styles.input}
                    placeholder='Event Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setEventName(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Event Description'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setEventDescription(val.trim())}
                />

                <Pressable style={styles.invertButton} onPress={showDatepicker}>
                    <Text style={[styles.text, styles.normalText]}>{dateText}</Text>
                </Pressable>
                <Pressable style={styles.invertButton} onPress={showTimepicker}>
                    <Text style={[styles.text, styles.normalText]}>{timeText}</Text>
                </Pressable>
                {show && <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    minimumDate={new Date().setDate(new Date().getDate() + 1)}
                    onChange={onDateTimeChange}
                />}
                <TextInput
                    style={styles.input}
                    placeholder='Address'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setAddress(val.trim())}
                />
                {eventPhoto && (
                    <Image
                        source={{ uri: eventPhoto }}
                        style={{ width: 160, height: 160, borderRadius: 160, marginVertical: 12 }}
                    />
                )}
                <Pressable style={styles.invertButton} onPress={handleProfilePhoto}>
                    <Text style={[styles.text, styles.normalText]}>Choose Event Photo</Text>
                </Pressable>
                <Pressable
                    onPress={createEvent}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>Create</Text>
                </Pressable>
                <Pressable
                    onPress={closeCreateEvent}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>Cancel</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}