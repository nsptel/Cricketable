import * as React from 'react';
import { TextInput, Text, Pressable, ScrollView, View } from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import HeaderComponent from './header';


const { styles } = require('../style');


export default CreateEvent = () => {

    const [eventName, setEventName] = React.useState('');
    const [eventDesription, setEventDescription] = React.useState('');
    const [dateTime, setDateTime] = React.useState('');
    const [city, setCity] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const [eventPhoto, setEventPhoto] = React.useState(null);
    const navigation = useNavigation();

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
        navigation.navigate('Events');
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
                <TextInput
                    style={styles.input}
                    placeholder='Date and Time'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setDateTime(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='City'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setCity(val.trim())}
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