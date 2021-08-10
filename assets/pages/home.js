import * as React from 'react';
import { Text, ScrollView, View, Image, Pressable, Dimensions } from 'react-native';
import HeaderComponent from './header';

const { styles } = require('../style');
const db = require('../../db_conn');
const { groupCard, eventCard } = require('../helpers');

export default HomeScreen = ({ route, navigation }) => {

    const [groups, setGroups] = React.useState([]);
    const [events, setEvents] = React.useState([]);
    const [grpImgActive, setGrpImgActive] = React.useState(0);
    const [evtImgActive, setEvtImgActive] = React.useState(0);

    //determining height and width
    const WIDTH = Dimensions.get('window').width;

    React.useEffect(() => {
        const getAsyncData = async () => {

            //Group Display Information
            let tempCat = [];
            db.collection('group').get().then(snap => {
                tempCat = snap.docs.map(el => groupCard(el, navigation));
                tempCat.push(
                    <View key={tempCat.length} style={{ minWidth: WIDTH * 0.9, justifyContent: 'center' }}>
                        <Pressable
                            style={{ alignSelf: 'center' }}
                            onPress={() => navigation.navigate("Groups")}>
                            <Text style={{ fontSize: 24, color: '#3107cb' }}>View All >></Text>
                        </Pressable>
                    </View>
                )
                setGroups(tempCat);
            });

            //Events Display Information
            let tempCat2 = [];
            db.collection('event').get().then(snap => {
                tempCat2 = snap.docs.map(el => eventCard(el, navigation));
                tempCat2.push(
                    <View key={tempCat2.length} style={{ minWidth: WIDTH * 0.9, justifyContent: 'center' }}>
                        <Pressable
                            style={{ alignSelf: 'center' }}
                            onPress={() => navigation.navigate("Events")}>
                            <Text style={{ fontSize: 24, color: '#3107cb' }}>View All >></Text>
                        </Pressable>
                    </View>
                )
                setEvents(tempCat2);
            });
        }
        getAsyncData();
    }, []);

    onchange = (nativeEvent, replace) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if (nativeEvent) {
            if (replace == 'grp') {
                if (slide != grpImgActive) {
                    setGrpImgActive(slide);
                }
            }
            if (replace == 'evt') {
                if (slide != evtImgActive) {
                    setEvtImgActive(slide);
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
                        contentContainerStyle={{ width: WIDTH * 4, flexGrow: 1, paddingHorizontal: '5%', justifyContent: 'space-between' }}
                        pagingEnabled
                        horizontal
                    >
                        {groups}
                    </ScrollView>
                </View>
                <Text></Text>
                <Text style={{ flexDirection: 'row', bottom: 0, alignSelf: 'center' }}>  {groups.map((e, index) =>
                    <Text key={index}
                        style={grpImgActive == index ? { margin: 3, color: '#3107cb' } : { margin: 3, color: 'white' }}>
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
                        contentContainerStyle={{ width: WIDTH * groups.length, flexGrow: 1, paddingHorizontal: '5%', justifyContent: 'space-between' }}
                        pagingEnabled
                        horizontal
                    >
                        {events}
                    </ScrollView>
                </View>
                <Text></Text>

                <Text style={{ flexDirection: 'row', bottom: 0, alignSelf: 'center' }}>  {events.map((e, index) =>
                    <Text key={index}
                        style={evtImgActive == index ? { margin: 3, color: '#3107cb' } : { margin: 3, color: 'white' }}>
                        {"  "}●{"  "}
                    </Text>)}
                </Text>
            </View>
        </ScrollView>


    );
}

module.exports = HomeScreen;
