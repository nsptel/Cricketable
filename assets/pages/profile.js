import * as React from 'react';
import { TouchableOpacity, Text, Image, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../context';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase';
import { useIsFocused } from '@react-navigation/native';

const { styles, profileStyles } = require('../style');

export default ProfileScreen = () => {
    const { state, dispatch } = React.useContext(AuthContext);
    const [profilePicURL, setProfilePicURL] = React.useState('');
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const logout = async () => {
        await AsyncStorage.clear();
        dispatch({ type: 'SIGN_OUT', userToken: null, userData: null });
    }

    const guidePage = () => {
        dispatch({ type: 'SIGN_IN', userToken: state.userToken, userGuide: true });
    }

    React.useEffect(() => {
        const getAsyncData = async () => {
            firebase.storage()
                .ref(state.userData.profile_pic)
                .getDownloadURL()
                .then((url) => setProfilePicURL(url));
        }
        getAsyncData();
    }, [profilePicURL, isFocused])

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={profileStyles.header}>
                    <View style={profileStyles.headerContent}>
                        <Image style={profileStyles.avatar}
                            source={(profilePicURL !== '') ? { uri: profilePicURL } : null} />
                        <Text style={[profileStyles.name, styles.bigText]}>{state.userData.first_name + ' ' + state.userData.last_name}</Text>
                        <Text style={profileStyles.name}>
                            <Ionicons name={"ios-mail-open-outline"} size={16} color={"white"} /> {state.userData.email}
                        </Text>
                        <Text style={profileStyles.name}>
                            <Ionicons name={"ios-location-outline"} size={16} color={"white"} /> {state.userData.city}
                        </Text>
                    </View>
                </View>
                <View style={profileStyles.body}>
                    <View>
                        <Text style={styles.smallText}>Preferences</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Update Profile")}>
                            <Text style={[profileStyles.option, styles.bigText]}>
                                <Ionicons name={"ios-create-outline"} size={18} color={"black"} />  Update Profile
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.smallText, { marginTop: 24 }]}>Other</Text>
                        <TouchableOpacity onPress={guidePage}>
                            <Text style={[profileStyles.option, styles.bigText]}>
                                <Ionicons name={"ios-book-outline"} size={18} color={"black"} />  Tutorials
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderTopWidth: 1, borderTopColor: '#bbb' }}>
                        <TouchableOpacity onPress={logout}>
                            <Text style={[profileStyles.option, styles.bigText, { color: "#ff3d74" }]}>
                                <Ionicons name={"ios-log-out-outline"} size={18} color={"#ff3d74"} />  Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
