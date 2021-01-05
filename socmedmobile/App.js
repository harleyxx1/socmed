import React, { useState, useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import axios from 'axios';
import FastImage from 'react-native-fast-image';

const App = () => {
  const [posts, setPost] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: 'https://dcsocmed.herokuapp.com/api/posts'
    }).then(res => setPost(res.data))
  },[])
 
  return (
    <View style={{flex: 1, paddingHorizontal: 5}}>
      <FlatList
        data={posts}
        renderItem={({ index, item }) => (
          <View key={item._id}>
            {
              item.postImage.map(element => (
                <FastImage
                    style={{ width: 200, height: 200 }}
                    source={{
                        uri: element.url,
                        priority: FastImage.priority.normal,
                    }}
                />
              ))
            }
            <Text style={{color: 'white'}}>{item.postText}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default App
