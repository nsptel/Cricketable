import * as React from 'react';
import { TextInput, Text, Pressable, ScrollView, View, SafeAreaView } from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from './header';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';

const { styles } = require('../style');
const db = require('../../db_conn');

let userData;

const SignUpScreen = () => {
    const [email, setEmail] = React.useState('');
    const [first_name, setFirstName] = React.useState('');
    const [last_name, setLastName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [city, setCity] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const [locationErr, setLocationErr] = React.useState(null);
    const { state, dispatch } = React.useContext(AuthContext);
    const navigation = useNavigation();
    const [geocode, setGeoCode] = React.useState(null);
    const [location, setLocation] = React.useState(null);

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
        let err = [];
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!reg.test(email) && email.length > 0) {
            err.push('Email is not valid.');
            result = false;
        }

        if (email.length == 0 || password.length == 0
            || first_name.length == 0 || last_name.length == 0
            || city == '') {
            err.push('One or more fields are empty.');
            result = false;
        }

        if (password.length < 8 || password.match(/[0-9]/g) === null
            || password.match(/[A-Z]/g) === null || password.match(/[a-z]/g) === null
            || password.includes('_' || '@' || '!')) {
            err.push('Password should be at least 8 characters long and must contain lowercase letter, uppercase letter, number and special character (@, _ or !).');
            result = false;
        } else if (password !== confirmPassword) {
            err.push('Password and Confirm Password should be equal.');
            result = false;
        }

        setErrors(err);
        return result;
    }

    const signUp = async () => {
        if (validation()) {
            const user = await db.collection('user')
                .where('email', '==', email)
                .get();
            if (user.docs.length == 0) {
                const userData = {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                    city: city,
                    profile_pic: '/profile_pics/sample.png',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                }

                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                await db.collection('user')
                    .add(userData)
                    .then(async (doc) => {
                        try {
                            await AsyncStorage.setItem('userId', doc.id);

                        } catch (err) {
                            console.log(err);
                        }
                        dispatch({ type: 'SIGN_IN', userToken: doc.id, userData: userData, userGuide: true });
                    });
            } else {
                setErrors(['Email is already registered. Please try again.']);
            }
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
                <HeaderComponent />
                {(errors.length > 0) ?
                    <View style={styles.errorBlock}>
                        {errors.map(el => (<Text style={styles.error} key={el}>{el}</Text>))}
                    </View>
                    : null}
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setEmail(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='First Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setFirstName(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Last Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
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
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    editable={false}
                    value={geocode == null ? 'City' : city}
                />
                {locationErr !== null && (<Text style={styles.error}>{locationErr}</Text>)}
                <Pressable onPress={getLocationAsync} style={styles.invertButton}>
                    <Text style={[styles.text, styles.normalText]}>
                        <Ionicons name={"ios-location-outline"} size={16} color={"black"} /> Get Location
                    </Text>
                </Pressable>
                <Text></Text>
                <Pressable
                    onPress={signUp}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Sign Up</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const LoginScreen = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const { state, dispatch } = React.useContext(AuthContext);
    const navigation = useNavigation();

    const validation = () => {
        setErrors([]);
        let result = true;
        let err = [];
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!reg.test(email) && email.length > 0) {
            err.push('Email is not valid.');
            result = false;
        }

        if (password.length == 0 || email.length == 0) {
            err.push('One or more fields are empty.');
            result = false;
        }

        setErrors(err);
        return result;
    }

    const login = async (email, password) => {

        if (validation()) {
            const user = await db.collection('user')
                .where('email', '==', email)
                .where('password', '==', password)
                .get();

            if (user.docs.length > 0) {
                userToken = user.docs[0].id;
                AsyncStorage.setItem('userId', userToken);
                dispatch({ type: 'SIGN_IN', userToken: userToken, userData: user.docs[0].data() });
            } else {
                setErrors(['Incorrect Credentials. Please try again.']);
            }
        }
    }


    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
                <HeaderComponent />
                {(errors.length > 0) ?
                    <View style={styles.errorBlock}>
                        {errors.map(el => (<Text style={styles.error} key={el}>{el}</Text>))}
                    </View>
                    : null}
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setEmail(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setPassword(val.trim())}
                />
                <Pressable
                    onPress={() => login(email, password)}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Login</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

module.exports = {
    'SignUpScreen': SignUpScreen,
    'LoginScreen': LoginScreen,
    'userData': userData,
}