import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import {UserMainContext} from '../../../Context/UserContext';
import WimitiColors from '../../../../WimitiColors';
import SuggestionsPlaceHolder from './SuggestionsPlaceHolder';
import Axios from 'axios';
import {backendUrl, backendUserImagesUrl} from '../../../../Config';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const width = Dimensions.get('window').width;

function UsersList({navigation}) {
  const context = useContext(UserMainContext);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    let sub = true;

    Axios.post(backendUrl + '/suggestions', {
      username: context.username,
      userId: context.userId,
    })
      .then(res => {
        if (sub) {
          setSuggestions(res.data);
          setIsLoadingSuggestions(false);
        }
      })
      .catch(err => {
        if (sub) {
          setIsLoadingSuggestions(false);
        }
        console.log(err);
      });

    return () => {
      sub = false;
    };
  }, []);

  return (
    <View style={{backgroundColor: WimitiColors.white, flex: 1}}>
      <SafeAreaView>
        <View style={{marginTop: 10, padding: 10}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{color: WimitiColors.black, fontSize: 20}}>
              Suggestions
            </Text>
            {isLoadingSuggestions && suggestions.length == 0 ? (
              <>
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
                <SuggestionsPlaceHolder />
              </>
            ) : (
              <View>
                {suggestions.map((user, index) => (
                  <Pressable
                    key={index}
                    onPress={() => navigation.navigate('ChattRoom', {user})}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginVertical: 10,
                      }}>
                      <View>
                        {user.image.trim() != '' && user.image != null ? (
                          <Image
                            source={{uri: backendUserImagesUrl + user.image}}
                            style={{width: 50, height: 50, borderRadius: 100}}
                          />
                        ) : (
                          <View
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 100,
                              backgroundColor: WimitiColors.black,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Icon
                              name="user"
                              size={40}
                              color={WimitiColors.white}
                            />
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          marginLeft: 10,
                          width: width - 80,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{color: WimitiColors.black}}>
                          {user.fname} {user.lname}
                        </Text>
                        <Text numberOfLines={1}>@{user.username}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default UsersList;