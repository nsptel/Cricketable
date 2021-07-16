import * as React from 'react';
import { Text, Pressable, ScrollView, View, Linking } from 'react-native';
import AuthContext from '../../context';
import HeaderComponent from './header';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { styles } = require('../style');

export default GuideScreen = () => {
    const { state, dispatch } = React.useContext(AuthContext);
    const closeGuide = async () => {
        var userToken;
        var userData;

        await AsyncStorage.getItem('userId').then((res) => {
            userToken = String(res);
        });

        await AsyncStorage.getItem('userData').then((res) => {
            userData = res;
        });
        
        dispatch({ type: 'SIGN_IN', userToken: userToken, userData: userData, userGuide: false });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <View>
                    <YoutubePlayer
                        height={250}
                        width={400}
                        play={false}
                        videoId={'AqtpNkMvj5Y'}
                    />
                </View>
                <Pressable
                    onPress={() => Linking.openURL('http://a.espncdn.com/media/pdf/110215/cricket101.pdf')}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Rules of Cricket</Text>
                </Pressable>
                <Text></Text>
                <Pressable
                    onPress={closeGuide}
                    style={styles.button}>
                    <Text style={[styles.invertText, styles.text]}>Close Tutorial</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

module.exports = GuideScreen;