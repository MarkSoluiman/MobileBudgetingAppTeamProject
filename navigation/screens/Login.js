// Components import
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Dimensions} from 'react-native'
import { auth } from '../../firebase.config';

// Exported function
export default function Login({navigation}){

    // Assign constants
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Logout function
    const handleLogout = async ()=>{
        await signOut(auth);
    }
  
    // Async as we will be calling firebase function to check if the email && password is entered
    const handleSubmit = async ()=>{
    
        // Checks that user has input an email and password
        if(email && password){
            try{
                await signInWithEmailAndPassword(auth, email, password)
            } catch(err) {
                console.log('got error: ', err.message)
                Alert.alert('LogIn Error: ',err.message)
            }
        } else{
            Alert.alert('LogIn error: Please enter email and password to log in')
        }
    }

    return(
        <View style={styles.background}>

            {/* Main heading */}
            <Text style={styles.headingText}>MOBILE</Text>
            <Text style={styles.headingText}>BUDGETING</Text>

            {/* Log in title and entry prompt */}
            <Text style={styles.subHeadingText}>LOG IN</Text>

            <TextInput 
                style={styles.textInput} 
                value={email}
                onChangeText={value => setEmail(value)}
                placeholder='Email'
            />

            {/* Password title and entry prompt */}
            <Text style={styles.subHeadingText}>PASSWORD</Text>

            <TextInput 
                style={styles.textInput}
                value={password}
                onChangeText={value => setPassword(value)}
                placeholder='Password'
                secureTextEntry={true} 
            /> 

            {/* Buttons */}
            <View style={styles.buttons}>

                {/* Sign up button */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('Sign Up')}
                >
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>

                {/* Log in button */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleSubmit} 
                >
                    <Text style= {styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
          </View> 

          <Pressable onPress={() => navigation.navigate('Reset Password')}>
            <Text style={styles.smallText}>Forgotten password?</Text>
          </Pressable>
        </View>
    )
}


// Styling
const styles = StyleSheet.create({
    background:{
        flex:1
        , backgroundColor: '#ff8101'
        , alignItems: 'center'
        , justifyContent: 'center'
    },
    buttons:{
        flexDirection: 'row'
        , width : Dimensions.get('window').width/2
        , justifyContent: 'space-between'
    },
    buttonText:{
        color: 'white',
    },
    headingText:{
      color : '#ffe9df', 
      fontWeight: 'bold',
      fontSize : 35,
      marginBottom: 5
    },
    subHeadingText:{
        color : 'white', 
        fontWeight: 'bold',
        fontSize : 15,
    },
    smallText:{
        color : '#903800', 
        fontStyle: 'italic',
        fontSize : 15,
        marginTop: 20,
    },
    button: {
        backgroundColor : '#903800',
        height: Dimensions.get('window').height/20,
        width: Dimensions.get('window').width/4.5,
        marginTop: 10,
        borderRadius: 20,
        justifyContent : 'center',
        alignItems : 'center'
    },
    textInput: {
        paddingLeft: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 9,
        borderColor:'#ffdeb7',
        backgroundColor : '#ffdeb7',
        width: Dimensions.get('window').width/2,
        marginVertical : 10
    }
})