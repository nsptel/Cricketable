import * as React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';
import HeaderComponent from './header';
import { useNavigation } from '@react-navigation/native';
import { Card, CardTitle, CardContent, CardText } from 'react-native-material-cards';


const { styles } = require('../style');
const db = require('../../db_conn');


export default EventsScreen = () => {

    const navigation = useNavigation();
    const [categories, setCategories] = React.useState([]);

    const data = async () => {
        let tempCat = [];
        db.collection('event').get().then(snap => {
            snap.forEach(el => {
                tempCat.push(
                    <Card>
                        <CardTitle>{el.data().image}</CardTitle>
                        <CardText>
                            {el.data().name}
                        </CardText>
                        <CardContent text={el.data().event_date} />
                    </Card>
                    // <Text>{el.data().name} - {el.data().description}</Text>
                )
            });
            setCategories(tempCat);
        });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <TouchableOpacity onPress={() => navigation.navigate("Create Event")}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>
                        Create Event
                    </Text>
                </TouchableOpacity>
                <Text onPress={(data)}>Click</Text>
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );

}
