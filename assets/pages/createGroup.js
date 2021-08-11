import * as React from 'react';
import { TextInput, Text, Image, Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase';
import AuthContext from '../../context';
import * as ImagePicker from 'expo-image-picker';

const { styles } = require('../style');
const db = require('../../db_conn');

export default CreateGroupScreen = () => {

    const [groupName, setGroupName] = React.useState('');
    const [groupDescription, setGroupDescription] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const [groupPhoto, setGroupPhoto] = React.useState('/group_pics/sample.png');
    const navigation = useNavigation();
    const { state, dispatch } = React.useContext(AuthContext);

    const validation = () => {
        setErrors([]);
        let result = true;
        let err = [];

        if (groupName.length == 0 || groupDescription.length == 0) {
            result = false;
            err.push("One or more fields are empty.");
        }

        setErrors(err);
        return result;
    }

    const createGroup = async () => {
        if (validation()) {
            await db.collection('group')
                .add({
                    name: groupName,
                    description: groupDescription,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    image: groupPhoto === '/group_pics/sample.png' ? groupPhoto : 'id',
                    user: db.doc('user/' + state.userToken),
                    name_lc: groupName.toLowerCase()
                }).then(async (doc) => {
                    if (groupPhoto !== '/group_pics/sample.png') {
                        const imageResponse = await fetch(groupPhoto);
                        const blob = await imageResponse.blob();

                        let ref = firebase.storage().ref('/group_pics').child(doc.id);
                        ref.put(blob, {
                            metadata: {
                                metadata: {
                                    firebaseStorageDownloadTokens: doc.id
                                }
                            }
                        });
                    }
                    await db.collection('members').add({
                        userId: state.userToken,
                        groupId: doc.id
                    });
                    navigation.navigate("Groups");
                });
        }
    }

    const handleProfilePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.cancelled) {
            setGroupPhoto(result.uri);
        }
    };

    const closeCreateGroup = () => {
        navigation.navigate('Groups');
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
                    style={styles.input}
                    placeholder='Group Name'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setGroupName(val.trim())}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Group Description'
                    autoCapitalize="none"
                    placeholderTextColor='#aaa'
                    onChangeText={val => setGroupDescription(val.trim())}
                />
                {groupPhoto !== '/group_pics/sample.png' && (
                    <Image
                        source={{ uri: groupPhoto }}
                        style={{ width: 160, height: 160, borderRadius: 160, marginVertical: 12 }}
                    />
                )}
                <Pressable style={styles.invertButton} onPress={handleProfilePhoto}>
                    <Text style={[styles.text, styles.normalText]}>Choose Group Photo</Text>
                </Pressable>
                <Pressable
                    onPress={createGroup}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>Create</Text>
                </Pressable>
                <Pressable
                    onPress={closeCreateGroup}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>Cancel</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}