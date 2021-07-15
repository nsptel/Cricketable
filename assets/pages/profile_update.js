import * as React from 'react';
import { TextInput, Image, Text, Button, Pressable, ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';


const { styles } = require('../style');
const db = require('../../db_conn');

export default ProfileUpdateScreen = () => {
    const { state, dispatch } = React.useContext(AuthContext);
    const [email, setEmail] = React.useState(state.userData.email);
    const [first_name, setFirstName] = React.useState(state.userData.first_name);
    const [last_name, setLastName] = React.useState(state.userData.last_name);
    const [password, setPassword] = React.useState();
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [city, setCity] = React.useState(state.userData.city);
    const [errors, setErrors] = React.useState([]);
    const [locationErr, setLocationErr] = React.useState(null);
    const [profilePhoto, setProfilePhoto] = React.useState(null);
    const navigation = useNavigation();
    const [geocode, setGeoCode] = React.useState(null);
    const [location, setLocation] = React.useState(null);
    let err = [];

    const getLocationAsync = async () => {
        setLocationErr(null);
        Location.requestForegroundPermissionsAsync().then(res => {
            if (res.status !== 'granted') {
                setLocationErr('Permission to access location was denied');
                return;
            }
        });
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        const { latitude, longitude } = location.coords
        getGeocodeAsync({ latitude, longitude })
        setLocation({ latitude, longitude });
    };

    const getGeocodeAsync = async (location) => {
        let geocode = await Location.reverseGeocodeAsync(location);
        setGeoCode(geocode);
        let city = geocode[0].city + ', '
            + geocode[0].region + ', '
            + geocode[0].isoCountryCode;
        setCity(city);
    }

    const validation = () => {
        setErrors([]);
        let result = true;
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!reg.test(email) && email.length > 0) {
            err.push('Email is not valid.');
            result = false;
        }

        if (email.length == 0 || password.length == 0
            || first_name.length == 0 || last_name.length == 0
            || city.length == 0) {
            err.push('One or more fields are empty.');
            result = false;
        }

        if (password !== confirmPassword) {
            err.push('Password and Confirm Password should be equal.');
            result = false;
        }

        setErrors(err);
        err = [];
        return result;
    }

    const handleProfilePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.cancelled) {
            setProfilePhoto(result.uri);
        }
    };

    const UpdateProfile = async () => {
        if (validation()) {
            let userData = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                city: city,
                profile_pic: state.userData.profile_pic,
            }
            if (profilePhoto !== null) {
                const imageResponse = await fetch(profilePhoto);
                const blob = await imageResponse.blob();

                let ref = firebase.storage().ref('/profile_pics').child(state.userToken);
                ref.put(blob);

                userData = { ...userData, profile_pic: '/profile_pics/' + state.userToken };
                await AsyncStorage.setItem('userData', JSON.stringify({ profile_pic: state.userToken }));
            }
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await db.collection('user')
                .doc(state.userToken)
                .update(userData)
                .then(() => {
                    navigation.navigate('Profile');
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
                    style={[styles.input, { color: 'grey' }]}
                    placeholder='Email'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    defaultValue={state.userData.email}
                    editable={false}
                    onChangeText={val => setEmail(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='First Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    defaultValue={state.userData.first_name}
                    onChangeText={val => setFirstName(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Last Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    defaultValue={state.userData.last_name}
                    onChangeText={val => setLastName(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setPassword(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Confirm Password'
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setConfirmPassword(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    editable={false}
                    placeholder='City'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    defaultValue={state.userData.city}
                    onChangeText={val => setCity(val.trim())}
                />
                {locationErr !== null && (<Text style={styles.error}>{locationErr}</Text>)}
                <Pressable onPress={getLocationAsync} style={styles.invertButton}>
                    <Text style={[styles.text, styles.normalText]}>
                        <Ionicons name={"ios-location-outline"} size={16} color={"black"} /> Get Location
                    </Text>
                </Pressable>
                {profilePhoto && (
                    <Image
                        source={{ uri: profilePhoto }}
                        style={{ width: 160, height: 160, borderRadius: 160, marginVertical: 12 }}
                    />
                )}
                <Pressable style={styles.invertButton} onPress={handleProfilePhoto}>
                    <Text style={[styles.text, styles.normalText]}>Choose Profile Photo</Text>
                </Pressable>
                <Pressable
                    onPress={UpdateProfile}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Update Profile</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}