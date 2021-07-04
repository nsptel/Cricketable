import * as React from 'react';
import { useState } from 'react';
import { Text, Pressable, ScrollView, View, Button, Linking } from 'react-native';
import AuthContext from '../../context';
import HeaderComponent from './header';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Link } from 'react-router-dom';
  
const { styles } = require('../style');

export default GuideScreen = () => {
    const { state, dispatch } = React.useContext(AuthContext);
    const closeGuide = () => {
        dispatch({type: 'SIGN_IN', userToken: state.userToken, userData: state.userData, userGuide: false});
        // console.log(userData);
        // console.log(userToken);
    }

    return (
        
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <View>
                    <YoutubePlayer
                        height={250}
                        width={400}
                        play={true}
                        videoId={'AqtpNkMvj5Y'}
                    />
                    
                </View>
                <Text style={styles.guideButtons}
                onPress={() => Linking.openURL('http://a.espncdn.com/media/pdf/110215/cricket101.pdf')}>
                Rules PDF
                </Text>
                <Text style={styles.guideButtons}
                onPress={closeGuide}>
                Close
                </Text>
                
            </View>
            
            
            
        </ScrollView>
    );
}

module.exports = GuideScreen;