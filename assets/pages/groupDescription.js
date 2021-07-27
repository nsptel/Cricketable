import * as React from 'react';
import { Text, TouchableOpacity, Pressable, ScrollView, View, SafeAreaView, FlatList } from 'react-native';
import AuthContext from '../../context';
import firebase from 'firebase';

const { styles } = require('../style');
const db = require('../../db_conn');

export default GroupDescriptionScreen = ({ route, navigation }) => {
    const { state, dispatch } = React.useContext(AuthContext);
    const groupId = route.params.groupId;
    const [member, setMember] = React.useState('');
    const [groupMembers, setGroupMembers] = React.useState([]);
    const [groupEvents, setGroupEvents] = React.useState([]);
    const [groupInfo, setGroupInfo] = React.useState({
        description: '',
        image: '',
        name: '',
        timestamp: null,
        user: null
    });

    React.useEffect(() => {
        setGroupMembers([]);
        setGroupEvents([]);
        // getting group and user information
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

        // checking if the user is a member of this group
        db.collection('members')
            .where('userId', '==', state.userToken)
            .where('groupId', '==', groupId)
            .get()
            .then((snap) => {
                if (snap.docs.length > 0) {
                    setMember(snap.docs[0].id);
                }
            });

        // getting all the members of the group
        db.collection('members')
            .where('groupId', '==', groupId)
            .get()
            .then((snap) => {
                if (snap.docs.length > 0) {
                    const userIds = snap.docs.map(el => el.data().userId);
                    db.collection('user')
                        .where(firebase.firestore.FieldPath.documentId(), 'in', userIds)
                        .get()
                        .then((userData) => {
                            let members = [];
                            for (var i in userData.docs) {
                                const el = userData.docs[i];
                                members.push({
                                    id: el.id,
                                    name: el.data().first_name + ' ' + el.data().last_name,
                                    email: el.data().email
                                });
                            }
                            setGroupMembers(members);
                        });
                } else {
                    setGroupMembers([]);
                }
            });

        // getting all the events associated with this group
        db.collection('members')
            .where('userId', '==', state.userToken)
            .where('groupId', '==', groupId)
            .get()
            .then((snap) => {
                if (snap.docs.length > 0) {
                    setMember(snap.docs[0].id);
                }
            });

        // getting all the members of the group
        db.collection('event')
            .where('group', '==', db.collection('group').doc(groupId))
            .get()
            .then((snap) => {
                if (snap.docs.length > 0) {
                    const eventIds = snap.docs.map(el => el.id);
                    db.collection('event')
                        .where(firebase.firestore.FieldPath.documentId(), 'in', eventIds)
                        .get()
                        .then((eventData) => {
                            let events = [];
                            for (var i in eventData.docs) {
                                const el = eventData.docs[i];
                                events.push({
                                    id: el.id,
                                    name: el.data().name
                                });
                            }
                            setGroupEvents(events);
                        });
                } else {
                    setGroupEvents([]);
                }
            });
    }, [member]);

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
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Create Event", { groupId: route.params.groupId })}
                style={styles.guideButtons}>
                <Text style={[styles.invertText, styles.text]}>
                    Create Event
                </Text>
            </TouchableOpacity>
            <Text>This is the description of the group {groupInfo.user && groupInfo.user.first_name}.</Text>
            <Text style={{ fontSize: 24 }}>Group Members</Text>
            {groupMembers !== [] ? (<FlatList
                data={groupMembers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                        <Text>{item.email}</Text>
                    </View>
                )}
            />) : (
                <Text>This group does not have any members.</Text>
            )}
            <Text style={{ fontSize: 24 }}>Group Events</Text>
            {groupEvents !== [] ? (<FlatList
                data={groupEvents}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />) : (
                <Text>This group does not have any events.</Text>
            )}
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
        </SafeAreaView>
    )
}