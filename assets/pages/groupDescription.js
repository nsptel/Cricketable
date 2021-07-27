import * as React from 'react';
import { Text, TouchableOpacity, Pressable, ScrollView, View } from 'react-native';
import AuthContext from '../../context';

const { styles } = require('../style');
const db = require('../../db_conn');

export default GroupDescriptionScreen = ({ route, navigation }) => {
    const { state, dispatch } = React.useContext(AuthContext);
    const groupId = route.params.groupId;
    const [member, setMember] = React.useState('');
    const [groupInfo, setGroupInfo] = React.useState({
        description: '',
        image: '',
        name: '',
        timestamp: null,
        user: null
    });

    React.useEffect(() => {
        db.collection('group')
            .doc(route.params.groupId)
            .get()
            .then((group) => {
                const data = group.data();
                setGroupInfo({
                    description: data.description,
                    image: data.image,
                    name: data.name,
                    timestamp: data.timestamp
                });
                return data.user.get();
            }).then((userInfo) => {
                setGroupInfo(prevState => ({
                    ...prevState,
                    user: userInfo.data()
                }));
            });

        db.collection('members')
            .where('userId', '==', state.userToken)
            .where('groupId', '==', groupId)
            .get()
            .then((snap) => {
                if (snap.docs.length > 0) {
                    setMember(snap.docs[0].id);
                }
            })
    }, []);

    const joinGroup = async () => {
        db.collection('members')
            .add({
                userId: state.userToken,
                groupId: groupId
            }).then((doc) => {
                setMember(doc.id);
            });
    }

    const leaveGroup = async () => {
        db.collection('members')
            .doc(member)
            .delete()
            .then(() => {
                setMember('');
            })
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate("Create Event", { groupId: route.params.groupId })}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>
                        Create Event
                    </Text>
                </TouchableOpacity>
                <Text>This is the description of the group {groupInfo.user && groupInfo.user.first_name}.</Text>
                {(member !== '') ? (
                    <Pressable
                        style={styles.button}
                        onPress={() => leaveGroup()}>
                        <Text style={[styles.invertText, styles.text]}>Leave Group</Text>
                    </Pressable>) : (
                    <Pressable
                        style={styles.button}
                        onPress={() => joinGroup()}>
                        <Text style={[styles.invertText, styles.text]}>Join</Text>
                    </Pressable>
                )}
            </View>
        </ScrollView>
    )
}