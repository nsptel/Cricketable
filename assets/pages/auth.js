import * as React from 'react';
import { TextInput, Text, Pressable, ScrollView, View } from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from './header';


const { styles } = require('../style');
const db = require('../../db_conn');

const SignUpScreen = () => {
    const [email, setEmail] = React.useState('');
    const [first_name, setFirstName] = React.useState('');
    const [last_name, setLastName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [city, setCity] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const navigation = useNavigation();

    const validation = () => {
        setErrors([]);
        let result = true;
        let err = [];
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!reg.test(email)) {
            err.push('Email is not valid.');
            result = false;
        }

        if (email.trim().length == 0 || password.trim().length == 0
            || first_name.trim().length == 0 || last_name.trim().length == 0
            || city.trim().length == 0) {
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
            await db.collection('user')
                .add({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                    city: city,
                    profile_pic: '/profile_pics/sample.png',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(async (doc) => {
                    try {
                        await AsyncStorage.setItem('userId', doc.id);
                    } catch (err) {
                        console.log(err);
                    }
                    navigation.navigate('Login');
                });
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
                    onChangeText={val => setEmail(val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='First Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setFirstName(val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Last Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setLastName(val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setPassword(val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Confirm Password'
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setConfirmPassword(val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='City'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setCity(val)}
                />
                <Pressable
                    onPress={signUp}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Sign Up</Text>
                </Pressable>
                <Text></Text>
                <Text style={[styles.normalText, styles.text]}>Already Have an Account?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.link, styles.text]}>Login</Text>
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
        if (!reg.test(email)) {
            err.push('Email is not valid.');
            result = false;
        }

        if (password.trim().length == 0) {
            err.push('Password field should not be empty.');
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
                await AsyncStorage.setItem('user', user.docs[0].id);
                // DevSettings.reload();
                dispatch({ type: 'SIGN_IN', token: user.docs[0].id });
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
                    onChangeText={val => setEmail(val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setPassword(val)}
                />
                <Pressable
                    onPress={() => login(email, password)}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Login</Text>
                </Pressable>
                <Text></Text>
                <Text style={[styles.normalText, styles.text]}>New Here?</Text>
                <Pressable onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[styles.link, styles.text]}>Sign Up</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

module.exports = {
    'SignUpScreen': SignUpScreen,
    'LoginScreen': LoginScreen,
}