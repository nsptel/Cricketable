import * as React from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import HeaderComponent from './header';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';

const { styles } = require('../style');
const db = require('../../db_conn');

export default EventsScreen = ({ route, navigation }) => {
    const [categories, setCategories] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [resetEvents, setResetEvents] = React.useState(true);

    const getCard = (el) => {
        return (
            <Card key={el.id} style={{ width: '90%' }}>
                <CardImage
                    source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/event_pics%2F${(el.data().image === 'id' ? 'sample.png' : el.id)}?alt=media&token=${(el.data().image === 'id' ? '84f8905a-bde0-4cd6-bd80-760dcd3fc0f0' : el.id)}` }}
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
            let tempCat = [];
            db.collection('event').get().then(snap => {
                tempCat = snap.docs.map(el => getCard(el));
                setCategories(tempCat);
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
                setCategories(tempEvents);
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
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );
}
