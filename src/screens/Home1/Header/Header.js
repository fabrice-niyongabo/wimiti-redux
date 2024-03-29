import React from 'react';
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/AntDesign';
import Icon3 from 'react-native-vector-icons/dist/Ionicons';
import WimitiColors from '../../../WimitiColors';
import {backendUserImagesUrl} from '../../../Config';
import {useSelector} from 'react-redux';

function Header({navigation}) {
  const {image} = useSelector(state => state.currentUser);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}>
      <Text
        style={{
          fontSize: 25,
          color: WimitiColors.black,
          fontWeight: 'bold',
        }}>
        Wimiti
      </Text>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View>
          <Icon3 name="search" size={30} color={WimitiColors.black} />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('CreatePost');
          }}>
          <View style={{marginHorizontal: 15}}>
            <Icon name="add-a-photo" size={30} color={WimitiColors.black} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Profile')}>
          <View>
            {image != null && image.trim() != '' ? (
              <Image
                source={{uri: backendUserImagesUrl + image}}
                style={{height: 30, width: 30, borderRadius: 50}}
              />
            ) : (
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 100,
                  backgroundColor: WimitiColors.black,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon2 name="user" size={20} color={WimitiColors.white} />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

export default Header;
