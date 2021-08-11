import * as React from 'react';
import { ScrollView, TouchableOpacity, Text, TextInput, View } from 'react-native';
import HeaderComponent from './header';
import { useIsFocused } from '@react-navigation/native';

const { styles } = require('../style');
const db = require('../../db_conn');
const { groupCard } = require('../helpers');

export default GroupsScreen = ({ route, navigation }) => {
    const [categories, setCategories] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [resetGroups, setResetGroups] = React.useState(true);
    const isFocused = useIsFocused();

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempCat = [];
            db.collection('group').get().then(snap => {
                tempCat = snap.docs.map(el => groupCard(el, navigation, { origin: "Groups" }));
                setCategories(tempCat);
            });
        }
        getAsyncData();
    }, [resetGroups, isFocused]);

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
                tempGroups = snap.docs.map(el => groupCard(el, navigation, { origin: "Groups" }));
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
}

module.exports = GroupsScreen;
