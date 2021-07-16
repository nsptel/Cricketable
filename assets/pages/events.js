import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import HeaderComponent from './header';
import { useNavigation } from '@react-navigation/native';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';

const { styles } = require('../style');
const db = require('../../db_conn');

export default EventsScreen = () => {

    // const navigation = useNavigation();
    // const [categories, setCategories] = React.useState([]);

    // React.useEffect(() => {
    //     let tempCat = [];
    //     db.collection('event').get().then(snap => {
    //         snap.forEach(el => {
    //             tempCat.push(
    //                 <Card key={el.id} style={{ width: '90%' }}>
    //                     <CardImage
    //                         source={{ uri: el.data().image }}
    //                         title={el.data().name}
    //                     />
    //                     <CardTitle
    //                         subtitle="date"
    //                     />
    //                     <CardContent text={el.data().description} />
    //                     <CardAction
    //                         separator={true}
    //                         inColumn={false}>
    //                         <CardButton
    //                             onPress={() => { navigation.navigate("Event Description") }}
    //                             style={{ width: '100%' }}
    //                             title="view event"
    //                             color="purple"
    //                         />
    //                     </CardAction>
    //                 </Card>
    //             )
    //         });
    //         setCategories(tempCat);
    //     });
    // });

    // return (
    //     <ScrollView>
    //         <View style={styles.container}>
    //             <HeaderComponent />
    //             <>
    //                 {categories}
    //             </>
    //         </View>
    //     </ScrollView>
    // );
    return(
        <ScrollView>
                <View style={styles.container}>
                    <HeaderComponent />
                    <Text style={[styles.normalText, styles.text]}>This is the event page!</Text>
                </View>
            </ScrollView>
    )

}
