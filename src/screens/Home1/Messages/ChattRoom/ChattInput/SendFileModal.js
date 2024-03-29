import React, {useEffect} from 'react';
import {View, Text, Pressable, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import WimitiColors from '../../../../../WimitiColors';
import SendFileInput from './SendFileInput';
import VideoPreview from './VideoPreview';
import AutoHeightImage from 'react-native-auto-height-image';
const width = Dimensions.get('window').width;

function SendFileModal({
  selectedFile,
  setSelectedFile,
  currentUsername,
  currentUserImage,
  replyMessage,
  setShowModal,
  user,
}) {
  useEffect(() => {
    if (selectedFile === null) setShowModal(false);
  }, []);
  return (
    <View style={{position: 'relative', flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingBottom: 10,
        }}>
        <Text
          style={{color: WimitiColors.black, fontSize: 20, fontWeight: '600'}}>
          Send File
        </Text>
        <Pressable onPress={() => setShowModal(false)}>
          <Icon name="close" size={30} color={WimitiColors.black} />
        </Pressable>
      </View>
      {selectedFile.type.split('/')[0] == 'image' && (
        <View>
          <AutoHeightImage source={{uri: selectedFile.uri}} width={width} />
        </View>
      )}

      {selectedFile.type.split('/')[0] == 'video' && (
        <VideoPreview selectedFile={selectedFile} />
      )}

      <View style={{position: 'absolute', bottom: 0, width}}>
        <SendFileInput
          user={user}
          currentUsername={currentUsername}
          currentUserImage={currentUserImage}
          selectedFile={selectedFile}
          setShowModal={setShowModal}
          setSelectedFile={setSelectedFile}
          replyMessage={replyMessage}
        />
      </View>
    </View>
  );
}

export default SendFileModal;
