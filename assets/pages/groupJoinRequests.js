import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const styles = require('../style');
const db = require('../../db_conn');

export default GroupJoinRequestsScreen = ({ route, navigation }) => {
    const groupId = route.params.groupId;
    const [requests, setRequests] = React.useState(null);
    const [reset, setReset] = React.useState(false);

    const Request = (props) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', width: '90%', marginHorizontal: '5%', marginVertical: 10, justifyContent: 'space-between' }}>
                <View style={{ flex: 1, alignSelf: 'center', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 18 }}>{props.name}</Text>
                    <Text style={styles.smallText}>{props.email}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-end' }}>
                    <Text onPress={() => {
                        db.collection('members')
                            .add({
                                userId: props.userId,
                                groupId: groupId
                            })
                            .then(doc => {
                                db.collection('requests')
                                    .where('groupId', '==', groupId)
                                    .where('userId', '==', props.userId)
                                    .get()
                                    .then(async (requests) => {
                                        await requests.docs[0].ref.delete();
                                        setReset(!reset);
                                    });
                            });
                    }}
                        style={{ fontSize: 18, borderWidth: 1, padding: 8, borderRadius: 24, borderColor: 'green', marginRight: 10 }}>
                        <Ionicons name="ios-checkmark" size={28} color="green" />
                    </Text>
                    <Text onPress={() => {
                        db.collection('requests')
                            .where('groupId', '==', groupId)
                            .where('userId', '==', props.userId)
                            .get()
                            .then(requests => {
                                requests.docs[0].ref.delete();
                                setReset(!reset);
                            });
                    }}
                        style={[styles.smallText, { borderWidth: 1, padding: 8, borderRadius: 24, borderColor: 'red' }]}>
                        <Ionicons name="ios-close" size={28} color="red" />
                    </Text>
                </View>
            </View>
        )
    }

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempRequests = [];
            db.collection('requests')
                .where('groupId', '==', groupId)
                .get()
                .then(async (snap) => {
                    if (snap.docs.length > 0) {
                        Promise.all(snap.docs.map(el => db.collection('user').doc(el.data().userId).get())).then(usersInfo => {
                            tempRequests = usersInfo.map(el => {
                                const { first_name, last_name, email } = el.data();
                                return (
                                    <Request key={el.id} name={first_name + ' ' + last_name} email={email} userId={el.id} />
                                )
                            });
                            setRequests(tempRequests);
                        });
                    } else {
                        setRequests(<Text style={{ padding: 10, fontSize: 16 }}>This group does not have any pending join requests.</Text>);
                    }
                })
        }
        getAsyncData();
    }, [reset]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <>
                    {requests}
                </>
            </View>
        </ScrollView>
    )
}