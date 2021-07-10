import * as React from 'react';
import { Text, ScrollView, View, TouchableOpacity } from 'react-native';
import HeaderComponent from './header';
import { useNavigation } from '@react-navigation/native';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';


const { styles } = require('../style');
const db = require('../../db_conn');


export default EventsScreen = () => {

    const navigation = useNavigation();
    const [categories, setCategories] = React.useState([]);

    React.useEffect( () => {
        let tempCat = [];
        db.collection('event').get().then(snap => {
            snap.forEach(el => {
                tempCat.push(
                    <Card style={{width: '90%'}}>
                        <CardImage
                            source={{ uri: el.data().image }}
                            title="Above all i am here"
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
                                // onPress={() => { }}
                                style = {{width: '100%'}}
                                title="See"
                                color="blue"
                            />
                            
                        </CardAction>
                    </Card>
                    
                )
            });
            setCategories(tempCat);
        });
    })

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
                {/* <Text onPress={(data)}>Click</Text> */}
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );

}
