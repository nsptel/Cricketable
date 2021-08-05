import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import HeaderComponent from './header';

const { styles } = require('../style');
const db = require('../../db_conn');
const { groupCard } = require('../helpers');

export default GroupsScreen = ({ route, navigation }) => {
    const [categories, setCategories] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [resetGroups, setResetGroups] = React.useState(true);

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempCat = [];
            db.collection('group').get().then(snap => {
                tempCat = snap.docs.map(el => groupCard(el, navigation));
                setCategories(tempCat);
            });
        }
        getAsyncData();
    }, [resetGroups]);

    const searchGroups = async () => {
        if (search.trim() === "") {
            setResetGroups(!resetGroups);
            return;
        }
        let tempGroups = [];
        db.collection('group')
            .orderBy('name_lc')
            .startAt(search.toLowerCase())
            .endAt(search.toLowerCase() + "\uf8ff")
            .get()
            .then((snap) => {
                tempGroups = snap.docs.map(el => groupCard(el, navigation));
                setCategories(tempGroups);
            });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <HeaderComponent />
                <TextInput
                    style={styles.input}
                    placeholder='Search Groups'
                    autoCapitalize='none'
                    defaultValue=''
                    placeholderTextColor='#aaa'
                    onChangeText={val => setSearch(val.trim())}
                    onSubmitEditing={() => searchGroups()}
                />
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );
}

module.exports = GroupsScreen;
