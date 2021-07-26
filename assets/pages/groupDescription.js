import * as React from 'react';
import { Text, TouchableOpacity, ScrollView, View } from 'react-native';

const { styles } = require('../style');
const db = require('../../db_conn');

export default GroupDescriptionScreen = ({ route, navigation }) => {

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
    }, []);

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
            </View>
        </ScrollView>
    )
}