import * as React from 'react';
import { Text, ScrollView, View, Image, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from './header';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton }
    from 'react-native-material-cards';

const { styles } = require('../style');
const db = require('../../db_conn');

export default HomeScreen = () => {

    const [groups, setGroups] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [grpimgActive, setgrpImgActive] = React.useState(0);
    const [evtimgActive, setevtImgActive] = React.useState(0);

    //determining height and width
    const WIDTH = Dimensions.get('window').width;

    const navigation = useNavigation();

    React.useEffect(() => {
        const getAsyncData = async () => {

            //Group Display Information
            let tempCat = [];
            db.collection('group').get().then(snap => {
                tempCat = snap.docs.map(el => (
                    <Card key={el.id} style={{ width: '90%' }}>
                        <CardImage
                            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${(el.data().image == 'id' ? 'sample.png' : el.id)}?alt=media&token=${(el.data().image == 'id' ? 'f689636c-d0cf-4471-882b-f717cea5bd53' : el.id)}` }}
                        />
                        <CardTitle
                            title={el.data().name}
                            subtitle={el.data().timestamp.toDate().toString()}
                        />
                        <CardContent text={el.data().description} />
                        <CardAction
                            separator={true}
                            inColumn={false}>
                            <CardButton
                                onPress={() => { navigation.navigate("Groups", { screen: "Group Description", initial: false, params: { groupId: el.id } }) }}
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

            //Events Display Information
            let tempCat2 = [];
            db.collection('event').get().then(snap => {
                tempCat2 = snap.docs.map(el => (
                    <Card key={el.id} style={{ width: '90%' }}>
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
                                onPress={() => { navigation.navigate("Events", { screen: "Event Description", initial: false, params: { eventId: el.id } }) }}
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

    onchange = (nativeEvent, replace) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if (nativeEvent) {
            if (replace == 'grp') {
                if (slide != grpimgActive) {
                    setgrpImgActive(slide);
                }
            }
            if (replace == 'evt') {
                if (slide != evtimgActive) {
                    setevtImgActive(slide);
                }
            }
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <Image source={require('../homePagePicture.jpeg')} style={{ height: 200, width: '100%', marginTop: -12 }} alt='homePage Picture'></Image>
                <Text style={{ fontSize: 24, color: '#000', marginTop: 10, marginLeft: '5%', alignSelf: 'flex-start', fontWeight: 'bold' }}>
                    Groups
                </Text>
                <View style={{ width: WIDTH }}>
                    <ScrollView style={{ marginTop: 10 }}
                        onScroll={({ nativeEvent, grp }) => onchange(nativeEvent, 'grp')}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        horizontal
                    >
                        {groups.map((e, index) => groups[index])}
                    </ScrollView>
                </View>

                <Text style={{ flexDirection: 'row', bottom: 0, alignSelf: 'center' }}>  {groups.map((e, index) =>
                    <Text key={index}
                        style={grpimgActive == index ? { margin: 3, color: '#3107cb' } : { margin: 3, color: 'white' }}>
                        {"  "}●{"  "}
                    </Text>)}
                </Text>

                <Text style={{ fontSize: 24, color: '#000', marginTop: 10, marginLeft: '5%', alignSelf: 'flex-start', fontWeight: 'bold' }}>
                    Events
                </Text>
                <View style={{ width: WIDTH }}>
                    <ScrollView style={{ marginTop: 10 }}
                        onScroll={({ nativeEvent, evt }) => onchange(nativeEvent, 'evt')}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        horizontal
                    >
                        {events.map((e, index) => events[index])}
                    </ScrollView>
                </View>

                <Text style={{ flexDirection: 'row', bottom: 0, alignSelf: 'center' }}>  {events.map((e, index) =>
                    <Text key={index}
                        style={evtimgActive == index ? { margin: 3, color: '#3107cb' } : { margin: 3, color: 'white' }}>
                        {"  "}●{"  "}
                    </Text>)}
                </Text>
            </View>
        </ScrollView>


    );
}

module.exports = HomeScreen;
