import * as React from 'react';
import { ScrollView, View, Pressable, Text, TextInput } from 'react-native';
import HeaderComponent from './header';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase';

const { styles } = require('../style');
const db = require('../../db_conn');
const { eventCard } = require('../helpers');

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
                tempEvents = snap.docs.map(el => (el.data().public) ? eventCard(el, navigation) : null);
                setCategories((tempEvents.length === 0) ? <Text>We could not find any events.</Text> : tempEvents);
            });
    };

    const showDatepicker = () => {
        setShow(true);
    };

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempEvents = [];
            db.collection('event').where('public', '==', true).get().then(snap => {
                tempEvents = snap.docs.map(el => eventCard(el, navigation));
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
            .where('public', '==', true)
            .orderBy('name_lc')
            .startAt(search.toLowerCase())
            .endAt(search.toLowerCase() + "\uf8ff")
            .get()
            .then((snap) => {
                tempEvents = snap.docs.map(el => eventCard(el, navigation));
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
            .where('public', '==', true)
            .get()
            .then((snap) => {
                tempEvents = snap.docs.map(el => eventCard(el, navigation));
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '86%', marginHorizontal: '7%' }}>
                    <DropDownPicker
                        placeholder="Filter by City"
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={[{ marginBottom: 10 }, styles.invertButton, { width: '94%' }]}
                        dropDownContainerStyle={{ width: '100%', borderRadius: 3 }}
                        listMode='SCROLLVIEW'
                        onChangeValue={(val) => filterCities(val)}
                    />
                    <Pressable onPress={() => setResetEvents(!resetEvents)} style={{ alignSelf: 'center' }}>
                        <Text style={styles.link}>clear</Text>
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginHorizontal: '5%' }}>
                    <Pressable style={styles.invertButton} onPress={showDatepicker}>
                        <Text style={[styles.text, styles.normalText]}>{dateText}</Text>
                    </Pressable>
                    <Pressable onPress={() => setResetEvents(!resetEvents)} style={{ alignSelf: 'center' }}>
                        <Text style={styles.link}>clear</Text>
                    </Pressable>
                </View>
                {show && <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onDateTimeChange}
                />}
                <Pressable style={styles.invertButton} onPress={() => navigation.navigate("Private Events")}>
                    <Text style={[styles.text, styles.normalText]}>View Private Events</Text>
                </Pressable>
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );
}
