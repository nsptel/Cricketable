import React from 'react';
import { Dimensions, View } from 'react-native';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';

// formatted time
const formatTime = (d) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} (${days[d.getDay()]})`;
}

// group card
const groupCard = (el, navigation) => {
    return (
        <View key={el.id} style={{ maxWidth: '90%', height: '30%' }}>
            <Card>
                <CardImage
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${(el.data().image == 'id' ? 'sample.png' : el.id)}?alt=media&token=${(el.data().image == 'id' ? 'f689636c-d0cf-4471-882b-f717cea5bd53' : el.id)}` }}
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
                        onPress={() => navigation.navigate("Group Description", { groupId: el.id })}
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
const eventCard = (el, navigation) => {
    return (
        <View key={el.id} style={{ maxWidth: '90%', height: '30%' }}>
            <Card>
                <CardImage
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/event_pics%2F${(el.data().image === 'id' ? 'sample.png' : el.id)}?alt=media&token=${(el.data().image === 'id' ? '84f8905a-bde0-4cd6-bd80-760dcd3fc0f0' : el.id)}` }}
                />
                <CardTitle
                    title={el.data().name}
                    subtitle={formatTime(el.data().event_date.toDate())}
                />
                <CardContent text={el.data().description} />
                <CardAction
                    separator={true}
                    inColumn={false}>
                    <CardButton
                        onPress={() => { navigation.navigate("Event Description", { eventId: el.id }) }}
                        style={{ width: '100%', backgroundColor: 'white' }}
                        title="View Event"
                        color="#3107cb"
                    />
                </CardAction>
            </Card>
        </View>
    );
}

module.exports = {
    "formatTime": formatTime,
    "groupCard": groupCard,
    "eventCard": eventCard
}