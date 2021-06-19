import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    input: {
        width: '90%',
        height: 55,
        margin: 10,
        paddingHorizontal: 8,
        paddingVertical: 12,
        color: 'black',
        borderRadius: 3,
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 12,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight
    },
    button: {
        paddingVertical: 16,
        width: '90%',
        borderRadius: 4,
        backgroundColor: 'purple',
    },
    text: {
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: 0.25,
    },
    invertText: {
        color: 'white'
    },
    normalText: {
        color: 'black'
    },
    link: {
        color: '#2071f5',
    }
});

module.exports = styles;