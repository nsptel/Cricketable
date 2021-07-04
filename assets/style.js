import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const accentColor = "purple";

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
    guideButtons: {paddingHorizontal: 8,
        paddingVertical: 12,
        color: 'black',
        borderRadius: 3,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: accentColor,
        marginBottom: 10,
        width: '50%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight,
    },
    button: {
        paddingVertical: 16,
        width: '90%',
        borderRadius: 4,
        backgroundColor: accentColor,
    },
    text: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 0.25,
    },
    headerTab: {
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderBottomColor: '#bbb',
        borderBottomWidth: 0.5,
        marginBottom: 12,
    },
    headerTitle: {
        textAlign: 'left',
        color: accentColor,
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    invertText: {
        color: 'white'
    },
    normalText: {
        color: 'black'
    },
    link: {
        color: '#2071f5',
    },
    smallText: {
        fontSize: 12,
    },
    bigText: {
        fontSize: 18,
    },
    error: {
        color: 'red',
        padding: 10,
        textAlign: 'left',
    },
    errorBlock: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'red',
        backgroundColor: '#fccaca',
        width: '90%',
        marginVertical: 10,
    }
});

// Profile Styling
const profileStyles = StyleSheet.create({
    header: {
        backgroundColor: accentColor,
        width: "100%",
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
    },
    name: {
        fontSize: 14,
        paddingVertical: 8,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        width: '100%',
        marginTop: 20,
        alignSelf: 'flex-start',
        paddingHorizontal: 18,
    },
    buttonContainer: {
        backgroundColor: accentColor,
        borderRadius: 22,
        minWidth: "80%",
        marginVertical: 14,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        paddingVertical: 14,
        textAlign: "center",
    },
    option: {
        paddingVertical: 18,
    }
});

module.exports = {
    "styles": styles,
    "profileStyles": profileStyles,
};