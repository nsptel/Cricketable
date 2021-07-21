import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import HeaderComponent from './header';
import { useNavigation } from '@react-navigation/native';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';

const { styles } = require('../style');
const db = require('../../db_conn');

export default EventsScreen = () => {

    const navigation = useNavigation();
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        let tempCat = [];
        let tmpArray = ['demo'];
        db.collection('event').get().then(snap => {
            let count = 0;
            for (var i in snap.docs) {
                const el = snap.docs[i];
                
                console.log(tmpArray.includes(el.id));
                if (tmpArray.includes(el.id)) {
                    break;
                }else{
                    tmpArray.push(el.id);
                    tempCat.push(
                        <Card key={el.id} style={{ width: '90%' }}>
                            <CardImage
                                source={{ uri: el.data().image }}
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
                                    onPress={() => { navigation.navigate("Event Description") }}
                                    style={{ width: '100%' }}
                                    title="view event"
                                    color="#3107cb"
                                />
                            </CardAction>
                        </Card>
                    )
                }
                if (count > 9) { break; }
                count++;
            };
            setCategories(tempCat);

        });
    });

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
    // return(
    //     <ScrollView>
    //             <View style={styles.container}>
    //                 <HeaderComponent />
    //                 <Text style={[styles.normalText, styles.text]}>This is the event page!</Text>
    //             </View>
    //         </ScrollView>
    // )
}
