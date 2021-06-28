import * as React from 'react';
import { TextInput, Text, Pressable, ScrollView, View } from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';

const { styles } = require('../style');
const db = require('../../db_conn');

class SignUpScreen extends React.Component {

    state = {
        email: 'nsp4898@gmail.com', first_name: 'Neel', last_name: 'Patel', password: 'Neel@4898', confirmPassword: 'Neel@4898', city: 'Thunder Bay', disabled: false
    }

    onChangeText = (key, val) => {
        this.setState({ [key]: val })
    }

    signUp = () => {

        this.setState({ disabled: true });

        db.collection('user')
            .add({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password,
                city: this.state.city,
                profile_pic: '/profile_pics/sample.png',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async (doc) => {
                try {
                    await AsyncStorage.setItem('userId', doc.id);
                } catch (err) {
                    console.log(err);
                }
                this.props.navigation.navigate('Login');
            });
    }

    render() {
        return (
            <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        autoCapitalize="none"
                        placeholderTextColor='#aaa'
                        defaultValue={this.state.email}
                        onChangeText={val => this.onChangeText('email', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='First Name'
                        autoCapitalize="none"
                        placeholderTextColor='#aaa'
                        defaultValue={this.state.first_name}
                        onChangeText={val => this.onChangeText('first_name', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Last Name'
                        autoCapitalize="none"
                        placeholderTextColor='#aaa'
                        defaultValue={this.state.last_name}
                        onChangeText={val => this.onChangeText('last_name', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholderTextColor='#aaa'
                        defaultValue={this.state.password}
                        onChangeText={val => this.onChangeText('password', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Confirm Password'
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholderTextColor='#aaa'
                        defaultValue={this.state.confirmPassword}
                        onChangeText={val => this.onChangeText('confirmPassword', val)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='City'
                        autoCapitalize="none"
                        placeholderTextColor='#aaa'
                        defaultValue={this.state.city}
                        onChangeText={val => this.onChangeText('city', val)}
                    />
                    <Pressable
                        onPress={this.signUp}
                        disabled={this.state.disabled}
                        style={styles.button}>
                        <Text style={[styles.invertText, styles.text]}>Sign Up</Text>
                    </Pressable>
                    <Text></Text>
                    <Text style={[styles.normalText, styles.text]}>Already Have an Account?</Text>
                    <Pressable onPress={() => {
                        this.props.navigation.navigate('Login')
                    }}>
                        <Text style={[styles.link, styles.text]}>Login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        )
    }
}

const LoginScreen = () => {
    const [email, setEmail] = React.useState('nsp4898@gmail.com');
    const [password, setPassword] = React.useState('Neel_4898');
    const { state, dispatch } = React.useContext(AuthContext);

    const login = async (email, password) => {
        const user = await db.collection('user')
            .where('email', '==', email)
            .where('password', '==', password)
            .get();

        if (user.docs.length > 0) {
            await AsyncStorage.setItem('user', user.docs[0].id);
            // DevSettings.reload();
            dispatch({ type: 'SIGN_IN', token: user.docs[0].id });
        } else {
            console.log('Incorrect Credentials');
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    defaultValue={email}
                    onChangeText={val => setEmail(val)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    defaultValue={password}
                    onChangeText={val => setPassword(val)}
                />
                <Pressable
                    onPress={() => login(email, password)}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Login</Text>
                </Pressable>
                <Text></Text>
                <Text style={[styles.normalText, styles.text]}>New Here?</Text>
                <Pressable onPress={() => {
                    this.props.navigation.navigate('SignUp')
                }}>
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
