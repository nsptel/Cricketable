import * as React from 'react';
import { Text, ScrollView, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from './header';
import CardSilder from 'react-native-cards-slider';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton }
    from 'react-native-material-cards';

const { styles } = require('../style');
const db = require('../../db_conn');

export default HomeScreen = () => {

    // return (
    //     <ScrollView>
    //         <View style={styles.container}>
    //             <HeaderComponent />
    //             <Text style={[styles.normalText, styles.text]}>This is the home page!</Text>
    //         </View>
    //     </ScrollView>
    // );
    const [groups, setGroups] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    
    const navigation = useNavigation();

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempCat = [];
            db.collection('group').get().then(snap => {
                tempCat = snap.docs.map(el => (
                    <Card key={el.id} style={{ width: '90%' }}>
                        <CardImage
                            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${el.id}?alt=media&token=${el.id}` }}
                            title={el.data().name}
                        />
                        <CardTitle
                            subtitle={el.data().timestamp.toDate().toString()}
                        />
                        <CardContent text={el.data().description} />
                        <CardAction
                            separator={true}
                            inColumn={false}>
                            <CardButton
                                onPress={() => { navigation.navigate("Groups", { screen: "Group Description", initial: false, params: {groupId: el.id} }) }}
                                style={{ width: '100%', backgroundColor: 'white' }}
                                title="view group"
                                color="purple"
                                color="#3107cb"
                            />
                        </CardAction>
                    </Card>
                ));
                setGroups(tempCat);
            });
            let tempCat2 = [];
            db.collection('event').get().then(snap => {
                tempCat2 = snap.docs.map(el => (
                    <Card key={el.id} style={{ width: '90%' }}>
                        <CardImage
                            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/event_pics%2F${el.id}?alt=media&token=${el.id}` }}
                            title={el.data().name}
                        />
                        <CardTitle
                            subtitle={el.data().event_date.toDate().toString()}
                        />
                        <CardContent text={el.data().description} />
                        <CardAction
                            separator={true}
                            inColumn={false}>
                            <CardButton
                                onPress={() => { navigation.navigate("Events", { screen: "Event Description", initial: false, params: {eventId: el.id} }) }}
                                style={{ width: '100%', backgroundColor: 'white' }}
                                title="View Event"
                                color="#3107cb"
                            />
                        </CardAction>
                    </Card>
                ));
                setEvents(tempCat2);
            });
        }
        getAsyncData();
    }, []);
    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                    <Image source={require('../homePagePicture.jpeg')} style={{height: 200, width: '100%'}} alt='homePage Picture'></Image>
                    <Text style={{ fontSize: 24, color: '#000', marginTop: 10, marginLeft: '5%', alignSelf: 'flex-start', fontWeight: 'bold' }}>
                        Groups
                    </Text>
                    <CardSilder style={{ marginTop: 10 }}>
                        {groups}
                    </CardSilder>
                    <Text style={{ fontSize: 24, color: '#000', marginTop: 10, marginLeft: '5%', alignSelf: 'flex-start', fontWeight: 'bold' }}>
                        Events
                    </Text>
                    <CardSilder style={{ marginTop: 10 }}>
                        {events}
                    </CardSilder>
            </View>
        </ScrollView>


    );
}

module.exports = HomeScreen;
