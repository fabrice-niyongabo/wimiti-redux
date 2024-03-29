import React, {useState, useEffect} from 'react';
import {
  Image,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon0 from 'react-native-vector-icons/dist/Ionicons';
import Icon2 from 'react-native-vector-icons/dist/AntDesign';
import Icon3 from 'react-native-vector-icons/dist/MaterialIcons';
import Icon4 from 'react-native-vector-icons/dist/FontAwesome5';
import Icon5 from 'react-native-vector-icons/dist/Feather';
import WimitiColors from '../../../WimitiColors';
import Carousel from 'pinar';
import {
  backendPostFilesUrl,
  backendUrl,
  backendUserImagesUrl,
} from '../../../Config';
import PostItemCommentSection from './PostItemCommentSection';
import Axios from 'axios';
import Video from './Video/Video';
import TimeAgo from 'react-native-timeago';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {useDispatch, useSelector} from 'react-redux';
import {handleLike, removePostLike} from '../../../actions/postLikes';
import {handleDislike, removePostDislike} from '../../../actions/postDislikes';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function PostItem({post, navigation, showCommentsPanel, setCommentsPostId}) {
  const dispatch = useDispatch();
  const {image, fname, lname, username, id} = useSelector(
    state => state.currentUser,
  );
  const {likes} = useSelector(state => state.postLikes);
  const {dislikes} = useSelector(state => state.postDislikes);
  const postContent = JSON.parse(post.content);
  const [isDisliking, setIsDisliking] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  // const handleLiking = () => {
  //   setIsLiking(true);
  //   Axios.post(backendUrl + '/handlePostLike', {
  //     postId: post.id,
  //     username: username,
  //     userId: context.userId,
  //   })
  //     .then(res => {
  //       // console.log(res.data);
  //       setIsLiking(false);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       setIsLiking(false);
  //     });
  // };

  const stateLikes = () => {
    const lk = likes.filter(item => item.postId == post.id);
    return lk.length;
  };

  const stateDislikes = () => {
    const lk = dislikes.filter(item => item.postId == post.id);
    return lk.length;
  };

  const checkIfCurrentUserLikedThisPost = () => {
    const lk = likes.filter(
      item =>
        (item.status === 'saved' || item.status === 'pending') &&
        item.postId == post.id &&
        item.username == username,
    );
    if (lk.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const checkIfCurrentUserDisLikedThisPost = () => {
    const lk = dislikes.filter(
      item =>
        (item.status === 'saved' || item.status === 'pending') &&
        item.postId == post.id &&
        item.username == username,
    );
    if (lk.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const requestPostDelete = () => {
    Alert.alert(
      'Confirm the process',
      'Do you want to parmanently delete this post? If yes, there will be no undo for the process.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'confirm',
          onPress: () => {
            handleDeletePost();
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleDeletePost = () => {
    setIsDeletingPost(true);
    Axios.post(backendUrl + '/deletePost', {
      postId: post.id,
      username: username,
      userId: id,
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        setIsDeletingPost(false);
        alert(error);
      });
  };

  return (
    <View
      style={{
        backgroundColor: WimitiColors.white,
        marginVertical: 10,
        paddingVertical: 10,
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
        <View>
          {post.owner.image != null && post.owner.image.trim() != '' ? (
            <Image
              source={{uri: backendUserImagesUrl + post.owner.image}}
              style={{height: 40, width: 40, borderRadius: 50}}
            />
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
                backgroundColor: WimitiColors.black,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon2 name="user" size={20} color={WimitiColors.white} />
            </View>
          )}
        </View>
        <View style={{width: '75%'}}>
          <Text style={{color: WimitiColors.black}}>
            {post.owner.fname} {post.owner.lname}
          </Text>
          <Text style={{color: WimitiColors.black, fontWeight: '500'}}>
            @{post.owner.username}
          </Text>
        </View>
        <View>
          <Menu
            visible={visible}
            anchor={
              <TouchableWithoutFeedback onPress={showMenu}>
                <View>
                  <Icon name="dots-horizontal" size={20} />
                </View>
              </TouchableWithoutFeedback>
            }
            onRequestClose={hideMenu}>
            {username !== post.owner.username && (
              <MenuItem onPress={hideMenu}>
                <Icon5 name="eye-off" /> Hide post
              </MenuItem>
            )}
            <MenuItem onPress={hideMenu}>
              <Icon2 name="sharealt" /> Share
            </MenuItem>

            {username === post.owner.username && (
              <>
                <MenuItem>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text>Comments</Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#81b0ff'}}
                      thumbColor={isEnabled ? WimitiColors.black : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </View>
                </MenuItem>
                <MenuDivider />
                <MenuItem onPress={() => requestPostDelete()}>
                  {isDeletingPost ? (
                    <Text>Deleting post...</Text>
                  ) : (
                    <>
                      <Icon name="delete-outline" size={18} />
                      <Text>Delete post</Text>
                    </>
                  )}
                </MenuItem>
              </>
            )}
          </Menu>
        </View>
      </View>
      {postContent.textContents.trim() != '' && (
        <View style={{paddingHorizontal: 10, paddingTop: 10}}>
          <Text>{postContent.textContents}</Text>
        </View>
      )}
      <View>
        {postContent.images.length > 0 && (
          <View style={{marginTop: 10}}>
            {postContent.images.length > 1 ? (
              <View>
                <Carousel
                  height={300}
                  autoplay={false}
                  width={width}
                  showsControls={false}
                  showsDots={true}>
                  {postContent.images.map((image, index) => (
                    <View key={index}>
                      <Image
                        source={{uri: backendPostFilesUrl + image}}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                        }}
                      />
                    </View>
                  ))}
                </Carousel>
              </View>
            ) : (
              <View>
                <Image
                  source={{uri: backendPostFilesUrl + postContent.images[0]}}
                  style={{width: undefined, height: undefined, aspectRatio: 1}}
                />
              </View>
            )}
          </View>
        )}
        {postContent.video && postContent.video.trim() != '' && (
          <Video postContent={postContent} />
        )}
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 10,
        }}>
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <TouchableWithoutFeedback
            onPress={() => {
              checkIfCurrentUserLikedThisPost()
                ? dispatch(removePostLike(post.id))
                : dispatch(handleLike(post.id));
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                marginRight: 15,
              }}>
              {checkIfCurrentUserLikedThisPost() ? (
                <Icon0 name="ios-heart" size={30} color={WimitiColors.red} />
              ) : (
                <Icon0
                  name="ios-heart-outline"
                  size={30}
                  color={WimitiColors.black}
                />
              )}
              <Text
                style={{
                  color: WimitiColors.black,
                  fontSize: 20,
                  paddingLeft: 5,
                }}>
                {parseInt(post.likes, 10) + stateLikes()}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() =>
              checkIfCurrentUserDisLikedThisPost()
                ? dispatch(removePostDislike(post.id))
                : dispatch(handleDislike(post.id))
            }>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                marginRight: 15,
              }}>
              {checkIfCurrentUserDisLikedThisPost() ? (
                <Icon0
                  name="ios-heart-dislike"
                  size={30}
                  color={WimitiColors.red}
                />
              ) : (
                <Icon0
                  name="ios-heart-dislike-outline"
                  size={30}
                  color={WimitiColors.black}
                />
              )}
              <Text
                style={{
                  color: WimitiColors.black,
                  fontSize: 20,
                  paddingLeft: 5,
                }}>
                {parseInt(post.dislikes, 10) + stateDislikes()}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              setCommentsPostId(post.id);
              showCommentsPanel();
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Icon3
                name="messenger-outline"
                size={30}
                color={WimitiColors.black}
              />
              <Text
                style={{
                  color: WimitiColors.black,
                  fontSize: 20,
                  paddingLeft: 5,
                }}>
                {post.comments}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
          <Icon4 name="wine-bottle" size={30} color={WimitiColors.black} />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 5,
        }}>
        <Icon0 name="ios-time-outline" size={18} />
        <TimeAgo time={post.date} style={{paddingLeft: 5}} />
      </View>

      <PostItemCommentSection post={post} />
    </View>
  );
}

export default PostItem;
