import * as React from 'react';
import { TextInput, Text, Pressable, ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';
import { useNavigation } from '@react-navigation/native';


const { styles } = require('../style');
const db = require('../../db_conn');

export default ProfileUpdateScreen = () => {
    const { state, dispatch } = React.useContext(AuthContext);
    // GdnfNDafllvugcexIiEl
    const [email, setEmail] = React.useState(state.userData.email);
    const [first_name, setFirstName] = React.useState(state.userData.first_name);
    const [last_name, setLastName] = React.useState(state.userData.last_name);
    const [password, setPassword] = React.useState();
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [city, setCity] = React.useState(state.userData.city);
    const [errors, setErrors] = React.useState([]);
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

    const UpdateProfile = async () => {
        if (validation()) {
            const userData = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                city: city,
                profile_pic: '/profile_pics/sample.png',
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
                    style={[styles.input, {color: 'grey'}]}
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
                    placeholder='City'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    defaultValue={state.userData.city}
                    onChangeText={val => setCity(val.trim())}
                />
                <Pressable
                    onPress={UpdateProfile}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Update Profile</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}