import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';

const styles = require('./style');

// formatted time
const formatTime = (d) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (${days[d.getDay()]})`;
}

// group card
const groupCard = (el, navigation, { origin }) => {
    return (
        <View key={el.id} style={{ maxWidth: '90%', flexShrink: 1 }}>
            <Card>
                <CardImage
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${(el.data().image === 'id' ? 'sample.png' : el.id)}?alt=media&token=${(el.data().image === 'id' ? 'f689636c-d0cf-4471-882b-f717cea5bd53' : el.id)}` }}
                />
                <CardTitle
                    title={el.data().name}
                    subtitle={formatTime(el.data().timestamp.toDate())}
                />
                <CardContent text={el.data().description} />
                <CardAction
                    separator={true}
                    inColumn={false}>
                    <CardButton
                        onPress={() => {
                            if (origin == "Groups") {
                                navigation.navigate("Group Description", { groupId: el.id });
                            } else {
                                navigation.navigate("Groups", {
                                    screen: "Group Description", initial: false, params: { groupId: el.id }
                                })
                            }
                        }}
                        style={{ width: '100%', backgroundColor: 'white' }}
                        title="view group"
                        color="purple"
                        color="#3107cb"
                    />
                </CardAction>
            </Card>
        </View>
    )
}

// event card
const eventCard = (el, navigation, { origin }) => {
    return (
        <View key={el.id} style={{ maxWidth: '90%', flexShrink: 1 }}>
            <Card>
                <CardImage
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/event_pics%2F${(el.data().image === 'id' ? 'sample.png' : el.id)}?alt=media&token=${(el.data().image === 'id' ? '84f8905a-bde0-4cd6-bd80-760dcd3fc0f0' : el.id)}` }}
                />
                <CardTitle
                    title={el.data().name}
                    subtitle={el.data().event_date.toDate().toString()}
                />
                <CardContent text={el.data().description} />
                <CardAction
                    separator={true}
                    inColumn={false}>
                    <CardButton
                        onPress={() => {
                            if (origin == "Events") {
                                navigation.navigate("Event Description", { eventId: el.id });
                            } else {
                                navigation.navigate("Events", {
                                    screen: "Event Description", initial: false, params: { eventId: el.id }
                                })
                            }
                        }}
                        style={{ width: '100%', backgroundColor: 'white' }}
                        title="View Event"
                        color="#3107cb"
                    />
                </CardAction>
            </Card>
        </View>
    );
}

const listProfile = (el, image) => {
    return (
        <ListItem style={{ width: '90%', marginHorizontal: '5%' }} key={el.id} bottomDivider>
            <Avatar source={{ uri: image }} style={{ width: 40, height: 40 }} rounded={true} />
            <View key={el.id} style={styles.flatListItem}>
                <Text style={styles.flatListText}>{el.data().first_name + ' ' + el.data().last_name}</Text>
                <Text style={[styles.flatListText, styles.smallText]}>{el.data().email}</Text>
            </View>
        </ListItem>
    )
}

module.exports = {
    "formatTime": formatTime,
    "groupCard": groupCard,
    "eventCard": eventCard,
    "listProfile": listProfile
}