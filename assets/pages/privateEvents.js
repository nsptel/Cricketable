import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import AuthContext from '../../context';
import { useIsFocused } from '@react-navigation/native';

const { styles } = require('../style');
const db = require('../../db_conn');
const { eventCard } = require('../helpers');

export default PrivateEventsScreen = ({ route, navigation }) => {
    const [categories, setCategories] = React.useState(null);
    const { state, dispatch } = React.useContext(AuthContext);
    const isFocused = useIsFocused();

    React.useEffect(() => {
        const getAsyncData = async () => {
            let tempEvents = [];

            db.collection('members')
                .where('userId', '==', state.userToken)
                .get()
                .then(snap => {
                    const groupRefs = snap.docs.map(el => db.collection('group').doc(el.data().groupId));
                    db.collection('event')
                        .where('group', 'in', groupRefs)
                        .where('public', '==', false)
                        .get()
                        .then(pvtEvents => {
                            tempEvents = pvtEvents.docs.map(el => eventCard(el, navigation, { origin: "Events" }));
                            setCategories((tempEvents.length === 0) ? <Text>We could not find any events.</Text> : tempEvents);
                        });
                });
        }
        getAsyncData();
    }, [isFocused]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <>
                    {categories}
                </>
            </View>
        </ScrollView>
    );
}
