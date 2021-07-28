import * as React from 'react';
import { Text, Image, TouchableOpacity, Pressable, View, SafeAreaView, FlatList } from 'react-native';
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
            {(groupInfo.image === null || groupInfo.image === 'id') ? (
                <Image
                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2Fsample.png?alt=media&token=f689636c-d0cf-4471-882b-f717cea5bd53' }}
                    style={[profileStyles.avatar, profileStyles.bigAvatar]}
                />
            ) : (
                <Image
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${groupInfo.image.trim()}?alt=media&token=${groupInfo.image.trim()}` }}
                    style={[profileStyles.avatar, profileStyles.bigAvatar]}
                />
            )}
            <TouchableOpacity onPress={() => navigation.navigate("Create Event", { groupId: route.params.groupId })}
                style={styles.guideButtons}>
                <Text style={[styles.invertText, styles.text]}>
                    Create Event
                </Text>
            </TouchableOpacity>
            <Text>This is the description of the group {groupInfo.user && groupInfo.user.first_name}.</Text>
            <Text style={styles.flatListHeader}>Group Members</Text>
            {groupMembers.length > 0 ? (<FlatList
                data={groupMembers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.flatListItem}>
                        <Text style={styles.flatListText}>{item.name + (groupInfo.user && (item.id == groupInfo.user.id) ? ' (Admin)' : '')}</Text>
                        <Text style={[styles.flatListText, styles.smallText]}>{item.email}</Text>
                    </View>
                )}
                style={{ alignSelf: 'flex-start', paddingHorizontal: '5%' }}
            />) : (
                <Text style={styles.flatListItem}>This group does not have any members.</Text>
            )}
            <Text style={styles.flatListHeader}>Group Events</Text>
            {groupEvents.length > 0 ? (<FlatList
                data={groupEvents}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.flatListItem}
                        onPress={() => {
                            navigation.navigate('Events', { screen: 'Event Description', params: { eventId: item.id } })
                        }}>
                        <Text style={[styles.flatListText, { color: '#3107cb' }]}>{item.name}</Text>
                    </Pressable>
                )}
                style={{ alignSelf: 'flex-start', paddingHorizontal: '5%' }}
            />) : (
                <Text style={styles.flatListItem}>This group does not have any events.</Text>
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