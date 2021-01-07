import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [posts, setPost] = useState([]);

  useEffect(() => {
    
  },[])

  const onpress = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      }); 

      const form = new FormData();
      form.append('age', '23');
      form.append('avatar', res);
      form.append('birthday', '12/2/2020');
      form.append('email', 'dingharley123@gmail.com');
      form.append('password', '123123');
      form.append('username', 'ley');
      form.append('firstname', 'ley');
      form.append('lastname', 'ley');

      axios({
        method: 'POST',
        url: 'http://192.168.1.8:5000/api/users/register',
        data: form, 
      }).then(res => console.log(res.data)).catch(err => console.log(err))

    } catch (err) {
      console.log(err)
    }
  }
 
  return (
    <View style={{ flex: 1, paddingHorizontal: 5 }}>
      <Button title="press" onPress = {onpress}/>
    </View>
  )
}

export default App
