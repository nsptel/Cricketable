import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import HeaderComponent from './header';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';

const { styles } = require('../style');
const db = require('../../db_conn');

export default EventsScreen = ({ route, navigation }) => {
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempCat = [];
            db.collection('event').get().then(snap => {
                tempCat = snap.docs.map(el => (
                    <Card key={el.id} style={{ width: '90%' }}>
                        <CardImage
                            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/event_pics%2F${el.id}?alt=media&token=${el.id}` }}
                            title={el.data().name}
                        />
                        {/* <CardTitle
                                subtitle={el.event_date.toDate().toString()}
                            /> */}
                        <CardContent text={el.data().description} />
                        <CardAction
                            separator={true}
                            inColumn={false}>
                            <CardButton
                                onPress={() => { navigation.navigate("Event Description", {eventId: el.id}) }}
                                style={{ width: '100%', backgroundColor: 'white' }}
                                title="View Event"
                                color="#3107cb"
                            />
                        </CardAction>
                    </Card>
                ));
                setCategories(tempCat);
            });
        }
        getAsyncData();
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );
}
