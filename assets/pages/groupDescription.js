import * as React from 'react';
import { Text, ScrollView, Image, TouchableOpacity, Pressable, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import AuthContext from '../../context';
import firebase from 'firebase';

const { styles, profileStyles } = require('../style');
const db = require('../../db_conn');

export default GroupDescriptionScreen = ({ route, navigation }) => {
    const { state, dispatch } = React.useContext(AuthContext);
    const groupId = route.params.groupId;
    const [member, setMember] = React.useState('');
    const [groupMembers, setGroupMembers] = React.useState([]);
    const [groupEvents, setGroupEvents] = React.useState([]);
    const [groupInfo, setGroupInfo] = React.useState({
        description: '',
        image: null,
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
                    user: { id: userInfo.id, ...userInfo.data() }
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
                            Promise.all(userData.docs.map(el => firebase.storage().ref(el.data().profile_pic).getDownloadURL()))
                                .then(images => {
                                    for (var i in userData.docs) {
                                        const el = userData.docs[i];
                                        members.push(
                                            <ListItem style={{ width: '90%', marginHorizontal: '5%' }} key={el.id} bottomDivider>
                                                <Avatar source={{ uri: images[i] }} />
                                                <View key={el.id} style={styles.flatListItem}>
                                                    <Text style={styles.flatListText}>{el.data().first_name + ' ' + el.data().last_name + ((groupInfo.user && el.id === groupInfo.user.id) ? ' (Admin)' : '')}</Text>
                                                    <Text style={[styles.flatListText, styles.smallText]}>{el.data().email}</Text>
                                                </View>
                                            </ListItem>
                                        );
                                    }
                                    setGroupMembers(members);
                                });
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
                                events.push(
                                    <Pressable
                                        style={styles.flatListItem}
                                        onPress={() => navigation.navigate('Events', { screen: 'Event Description', initial: false, params: { eventId: el.id } })}
                                        key={el.id}>
                                        <Text style={[styles.flatListText, { color: '#3107cb' }]}>{el.data().name}</Text>
                                    </Pressable>
                                );
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
        <ScrollView>
            <View style={styles.container}>
                {(groupInfo.image === null || groupInfo.image === 'id') ? (
                    <Image
                        source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${groupId}?alt=media&token=${groupId}` }}
                        style={[profileStyles.avatar, profileStyles.bigAvatar]}
                    />
                ) : (
                    <Image
                        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2Fsample.png?alt=media&token=f689636c-d0cf-4471-882b-f717cea5bd53' }}
                        style={[profileStyles.avatar, profileStyles.bigAvatar]}
                    />
                )}
                <Text style={{ fontSize: 28 }}>{groupInfo.name}</Text>
                <Text style={styles.subtitle}>{groupInfo.description}</Text>
                <Text style={styles.subtitle}>Created on {groupInfo.timestamp && groupInfo.timestamp.toDate().toString()}</Text>
                <Text></Text>
                <Text style={styles.flatListHeader}>Group Members</Text>
                {groupMembers.length > 0 ? (
                    <>
                        {groupMembers}
                    </>
                ) : (
                    <Text style={styles.flatListItem}>This group does not have any members.</Text>
                )}
                <Text></Text>
                <Text style={styles.flatListHeader}>Group Events</Text>
                {groupEvents.length > 0 ? (
                    <>
                        {groupEvents}
                    </>
                ) : (
                    <Text style={styles.flatListItem}>This group does not have any events.</Text>
                )}
                <Text></Text>
                {(groupId === '2C9Em7AvtIYobOnnwKCc') ? (
                    <TouchableOpacity onPress={() => navigation.navigate("Join Requests")}
                        style={styles.invertButton}>
                        <Text style={[styles.text, styles.normalText]}>
                            View Join Requests
                        </Text>
                    </TouchableOpacity>
                ) : (
                    null
                )}
                <TouchableOpacity onPress={() => navigation.navigate("Create Event", { groupId: route.params.groupId })}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>
                        Create Event
                    </Text>
                </TouchableOpacity>
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