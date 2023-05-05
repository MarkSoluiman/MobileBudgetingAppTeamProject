// Component imports
import { TouchableOpacity, View, Text, SafeAreaView, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { app, auth, db, firebase } from '../../firebase.config'
import { collection, getDoc, deleteDoc } from 'firebase/firestore/lite'
import { QuerySnapshot } from '@firebase/firestore'
import { getAuth } from 'firebase/auth'
import Ionicones from 'react-native-vector-icons/Ionicons'

// Exported function
export default function Goals({navigation}){

    // Initialise constants
    const [goalsList, setGoalsList] = useState([])
    const [selectionID, setSelectionID] = useState([])

    // User-specific data fetching where goals are incomplete, ordered from nearest due entries
    const todoRef = firebase.firestore().collection('Goals').where('uid', '==',getAuth().currentUser.uid).where('goal_complete','==', false).orderBy('goal_date', 'asc')

    // Use effect for fetching goals log data
    useEffect( () => {
        async function fetchData(){
            todoRef
            .onSnapshot(
                querySnapshot => {
                    const goalsList = []
                    querySnapshot.forEach((doc) => {
                        const {day, month, year, goal_date, goal_name, goal_balance, goal_amount} = doc.data()
                        goalsList.push({

                            // Formatting date, converting from Firestore TIMESTAMP to DD/MM/YYYY
                            day: goal_date.toDate().getDate().toString().padStart(2, '0'),
                            month: (goal_date.toDate().getMonth() + 1).toString().padStart(2, '0'),
                            year: goal_date.toDate().getFullYear().toString().slice(-2),
                            goal_date,
                            goal_name,
                            goal_balance,
                            goal_amount,
                        })
                    })
                    setGoalsList(goalsList)
                }
            )
        }
        fetchData()
    }, [])

    function deleteEntry(selectedGoalDate, selectedGoalName, selectedGoalAmount){
        console.log(selectedGoalDate)
        console.log(selectedGoalName)
        console.log(selectedGoalAmount)
        firebase.firestore()
          .collection('Goals')
          .where('uid', '==', getAuth().currentUser.uid)
          .where('goal_date', '==', selectedGoalDate)
          .where('goal_name', '==', selectedGoalName)
          .where('goal_amount', '==', selectedGoalAmount)
          .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                setSelectionID(documentSnapshot.id)
            })
        })
        .catch(error => {
            console.error(error)
        })
        firebase.firestore()
          .collection('Goals')
          .doc(selectionID).delete()
        setSelectionID(0)
      }

    return(
        <SafeAreaView style={styles.background}>

            {/* New goal button */}
            <Pressable style={styles.button} onPress={()=> navigation.navigate('New Goal')}>
                <Text style={styles.buttonText}>NEW GOAL</Text>
            </Pressable>

            {/* List of goals */}
            <View style={styles.widget}>
                <FlatList
                    data={goalsList}
                    numColumns={1}
                    renderItem={({item}) => (
                        <View style={styles.entry}>
                    
                        {/* Formatting of entries */}
                            <Text style={styles.textEntry}>{item.day}/{item.month}/{item.year}{'\n'}{item.goal_name}{'\n'}${item.goal_balance}/${item.goal_amount}{'\n'}</Text>
                            <Pressable style={styles.icon} onPress={() => deleteEntry(
                                item.goal_date
                                , item.goal_name
                                , item.goal_amount)}
                            >
                                <Ionicones name='trash-bin' size={15} color='#682d01'/>
                            </Pressable>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

// Styling
const styles = StyleSheet.create({
    background:{
        flex:1
        , paddingTop: '5%'
        , backgroundColor: '#ffdeb7'
    },
    textEntry:{
        width: 315,
        fontWeight: '400'
    },
    widget:{
        marginHorizontal: '5%'
        , marginVertical: '5%'
        , borderRadius: 15
        , width: 370
        , height: 605
        , padding: 15
        , backgroundColor: '#ff8100'
        , justifyContent: 'space-evenly'
    },
    icon:{
    paddingVertical: 5,
    },
    entry:{
    flexDirection: 'row',
    },
    button:{
        width: 370
        , height: 55
        , borderRadius: 30
        , marginHorizontal: 20
        , backgroundColor: '#bd5100'
        , justifyContent: 'center'
    },
    buttonText:{
        textAlign: 'center'
        , fontSize: 17
        , fontWeight: 'bold'
    }
})