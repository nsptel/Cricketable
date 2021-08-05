import * as React from 'react';
import { ScrollView, View, Pressable, Text, TextInput } from 'react-native';
import HeaderComponent from './header';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';
import firebase from 'firebase';

const { styles } = require('../style');
const db = require('../../db_conn');

export default EventsScreen = ({ route, navigation }) => {
    const [categories, setCategories] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const [resetEvents, setResetEvents] = React.useState(true);
    const [date, setDate] = React.useState(new Date());
    const [show, setShow] = React.useState(false);
    const [dateText, setDateText] = React.useState('Filter by Date');
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [items, setItems] = React.useState([
        { label: 'All Cities', value: 'All Cities' },
        { label: 'Thunder Bay, Ontario, CA', value: 'Thunder Bay, Ontario, CA' },
        { label: 'Toronto, Ontario, CA', value: 'Toronto, Ontario, CA' },
    ]);

    const onDateTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        setDate(currentDate);
        setShow(Platform.OS === 'ios' ? true : false);
        setDateText(`${months[currentDate.getUTCMonth()]} ${currentDate.getUTCDate()}, ${currentDate.getUTCFullYear()}`);
        let tempEvents = [];
        db.collection('event')
            .where('event_date', '>', firebase.firestore.Timestamp.fromDate(currentDate))
            .where('event_date', '<', firebase.firestore.Timestamp.fromDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)))
            .get()
            .then((snap) => {
                tempEvents = snap.docs.map(el => getCard(el));
                setCategories((tempEvents.length === 0) ? <Text>We could not find any events.</Text> : tempEvents);
            });
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const getCard = (el) => {
        return (
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
                        onPress={() => { navigation.navigate("Event Description", { eventId: el.id }) }}
                        style={{ width: '100%', backgroundColor: 'white' }}
                        title="View Event"
                        color="#3107cb"
                    />
                </CardAction>
            </Card>
        );
    }

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempEvents = [];
            db.collection('event').get().then(snap => {
                tempEvents = snap.docs.map(el => getCard(el));
                setCategories((tempEvents.length === 0) ? <Text>We could not find any events.</Text> : tempEvents);
            });
        }
        getAsyncData();
    }, [resetEvents]);

    const searchEvents = async () => {
        if (search.trim() === "") {
            setResetEvents(!resetEvents);
            return;
        }
        let tempEvents = [];
        db.collection('event')
            .orderBy('name_lc')
            .startAt(search.toLowerCase())
            .endAt(search.toLowerCase() + "\uf8ff")
            .get()
            .then((snap) => {
                tempEvents = snap.docs.map(el => getCard(el));
                setCategories((tempEvents.length === 0) ? <Text>We could not find any events.</Text> : tempEvents);
            });
    }

    const filterCities = (val) => {
        if (val == 'All Cities') {
            setResetEvents(!resetEvents);
            return;
        }
        let tempEvents = [];
        db.collection('event')
            .where('address', '==', val)
            .get()
            .then((snap) => {
                tempEvents = snap.docs.map(el => getCard(el));
                setCategories((tempEvents.length === 0) ? <Text>We could not find any events.</Text> : tempEvents);
            });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <TextInput
                    style={styles.input}
                    placeholder='Search Events'
                    autoCapitalize='none'
                    defaultValue=''
                    placeholderTextColor='#aaa'
                    onChangeText={val => setSearch(val.trim())}
                    onSubmitEditing={() => searchEvents()}
                />
                <DropDownPicker
                    placeholder="Filter by City"
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{ marginBottom: 10 }}
                    containerStyle={{ width: '90%', marginHorizontal: '5%' }}
                    listMode='SCROLLVIEW'
                    onChangeValue={(val) => filterCities(val)}
                />
                <Pressable style={styles.invertButton} onPress={showDatepicker}>
                    <Text style={[styles.text, styles.normalText]}>{dateText}</Text>
                </Pressable>
                {show && <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    // minimumDate={new Date().setDate(new Date().getDate() + 1)}
                    onChange={onDateTimeChange}
                />}
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );
}
