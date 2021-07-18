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
        let tempCat = [];
        db.collection('group').get().then(snap => {
            snap.forEach(el => {
                tempCat.push(
                    <Card key={el.id} style={{ width: '90%' }}>
                        <CardImage
                            source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cricketable-c1bac.appspot.com/o/group_pics%2F${el.id}?alt=media&token=${el.id}` }}
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
                                onPress={() => { navigation.navigate("Group Description", {groupId: el.id}) }}
                                style={{ width: '100%' }}
                                title="view group"
                                color="#3107cb"
                            />
                        </CardAction>
                    </Card>
                )
            });
            setCategories(tempCat);
        });
    });

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <TouchableOpacity onPress={() => navigation.navigate("Create Group")}
                    style={styles.guideButtons}>
                    <Text style={[styles.invertText, styles.text]}>
                        Create Group
                    </Text>
                </TouchableOpacity>
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
    //                 <Text style={[styles.normalText, styles.text]}>This is the group page!</Text>
    //             </View>
    //         </ScrollView>
    // )
}

module.exports = GroupsScreen;
