import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import HeaderComponent from './header';
import { Card, CardTitle, CardContent, CardImage, CardAction, CardButton } from 'react-native-material-cards';

const { styles } = require('../style');
const db = require('../../db_conn');

export default GroupsScreen = () => {
    const [categories, setCategories] = React.useState([]);
    const navigation = useNavigation();

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempCat = [];
            db.collection('group').get().then(snap => {
                tempCat = snap.docs.map(el => (
                    <Card key={el.id} style={{ width: '90%' }}>
                        <CardImage
                            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${(el.data().image == 'id' ? 'sample.png' : el.id)}?alt=media&token=${(el.data().image == 'id' ? 'f689636c-d0cf-4471-882b-f717cea5bd53' : el.id)}` }}
                            title={el.data().name}
                        />
                        <CardTitle
                            subtitle={el.data().timestamp.toDate().toString()}
                        />
                        <CardContent text={el.data().description} />
                        <CardAction
                            separator={true}
                            inColumn={false}>
                            <CardButton
                                onPress={() => navigation.navigate("Group Description", { groupId: el.id }) }
                                style={{ width: '100%', backgroundColor: 'white' }}
                                title="view group"
                                color="purple"
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

module.exports = GroupsScreen;
