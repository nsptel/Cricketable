import * as React from 'react';
import { TextInput, Text, Pressable, ScrollView, View } from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from './header';


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
                        // navigation.navigate('Login');
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
                    placeholder='City'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setCity(val.trim())}
                />
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
                console.log(userToken);
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