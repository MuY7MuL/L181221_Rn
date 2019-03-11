/*
*    create by mumu_ly   
*    2019-01-07
*    react_native_map
*/

import React, {Component} from 'react';
import{
    View,
    StyleSheet,
    Platform,
    StatusBar,
} from 'react-native';

import Utils from './utils';
import Icons from 'react-native-vector-icons/Ionicons';
// import MapView from 'react-native-maps'
import PropTypes from 'prop-types';
import Video from 'react-native-video'

export default class extends Component{
    constructor(){
        super();
        this.state={
           
        }
    }
    componentDidMount(){
        if(Platform.OS=== 'ios'){
           StatusBar.setBarStyle(0) 
        }
    }
    render(){
        return(
            <View style={styles.container}> 
                <Video
                    source={require('../src/img/moments.mp4')}   //设置本地视频地址   
                    // source={{uri:'https:***.***'}}            //设置在线视频地址
                    ref={(ref)=>{
                     this.player = ref
                    }}
                    onBuffer={this.onBuffer}                     //视频缓冲回调
                    onEnd = {this.onEnd}                         //播放结束后的回调
                    onError = {this.onError}                     //播放失败后的回调
                    style = {styles.backgroundVideo}             //样式设置
                    />   

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        alignContent:'center',
        flex:1
    },
    backgroundVideo:{
        position:'absolute',
        top:0,
        left:0,
        bottom :0,
        right:0
    }

})



