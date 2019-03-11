/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet,
  Text,
  View,
  Image,
  NavigatorIOS,
  ScrollView,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  PixelRatio
  } from 'react-native';
  const {width,height} = Dimensions.get('window');
  const pixel = 1 / PixelRatio.get();

import {Navigator} from 'react-native-deprecated-custom-components'
import Icon from 'react-native-vector-icons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper'
import Util from './src/utils'

import Day1 from './src/dayView1';
import Day2 from './src/dayView2';
import Day3 from './src/dayView3';
import Day4 from './src/dayView4';
import Day5 from './src/dayView5';
import Day6 from './src/dayView6';
import Day7 from './src/dayView7';

class MainView extends Component{
  constructor(){
    super();
    this.state = {
      days:[{
        kye: 0,
        title:'progressHub',
        component: Day1,
        isFA: false,
        icon: require('./src/images/day1.png'),
        size: 48,
        color: "#ff856c",
        hideNav :  false,
      },{
        kye: 1,
        title:'',
        component: Day2,
        isFA: false,
        icon: require('./src/images/day2.png'),
        size: 48,
        color: "#90bdc1",
        hideNav :  false,
      },{
        kye: 2,
        title:'',
        component: Day3,
        isFA: false,
        icon: require('./src/images/day3.png'),
        size: 48,
        color: "#2aa2ef",
        hideNav :  false,
      },{
        kye: 3,
        title:'',
        component: Day4,
        isFA: false,
        icon: require('./src/images/day4.png'),
        size: 48,
        color: "#00D204",
        hideNav :  false,
      },{
        kye: 4,
        title:'',
        component: Day5,
        isFA: false,
        icon: require('./src/images/day5.png'),
        size: 48,
        color: "#90bdc1",
        hideNav :  false,
      },{
        kye: 5,
        title:'',
        component: Day6,
        isFA: false,
        icon: require('./src/images/day6.png'),
        size: 48,
        color: "#00D204",
        hideNav :  false,
      },
      ,{
        kye: 6,
        title:'',
        component: Day7,
        isFA: false,
        icon: require('./src/images/day7.png'),
        size: 48,
        color: "#00D204",
        hideNav :  false,
      }]
    }
  }

  _jumpToPage(index){
    this.props.navigator.push({
      title: this.state.days[index].title,
      index:index + 1,
      display : !this.state.days[index].hideNav,
      component : this.state.days[index].component
    })
  }

  render(){
    var onThis = this;
    var boxs = this.state.days.map(function(elem,index){
      return(
        <TouchableHighlight key={elem.key} style={[styles.touchBox]} underlayColor="#eee" onPress={()=>onThis._jumpToPage(index)}>
          <View style={[styles.boxContainer]}>    
            <Image source={elem.icon} style={[styles.boxIcon,{backgroundColor:elem.color}]}></Image>
            <Text style={styles.boxText}>Day{index+1}</Text>
          </View>
         </TouchableHighlight>
      );
    })
    return(
      <ScrollView style={styles.mainView} title={this.props.title}>
        <Swiper height={150} showsButtons={false} autoplay={true}
        activeDot={<View style={{backgroundColor:'rgba(255,255,255,0.8)',width:8,height:8,borderRadius:4,marginLeft:3,marginRight:3,marginTop:3,marginBottom:3}}/>}>
          <TouchableHighlight onPress={()=>onThis._jumpToPage(0)}>
            <View style={styles.slide}>
              <Image style={[styles.image,{backgroundColor:'#FFC0CB'}]}></Image>
              <Text style={styles.slideText}>Day1:PrigressHub</Text>
            </View>
          </TouchableHighlight>
        </Swiper>
        <View style={styles.touchBoxContainer}>
          {boxs}
        </View>
      </ScrollView>
    )
  }

}
export default class App extends Component{
  componentDidMount(){
    StatusBar.setBarStyle(0);
  }

  configureScene(route,routeStack){
    if(route.type == "Boottom"){
      return Navigator.SceneConfigs.FloatFromBottom ; 
    }
    return Navigator.SceneConfigs.PushFromRight ; 
  }

  routeMapper = {
    LeftButton:(route,navigator,index,navState) => {
      if(route.index >0){
        return<TouchableOpacity
          underlayColor = "transparent"
          onPress={()=> {if(index>0) {navigator.pop()}}}>
            <Text style={styles.navBackBtn}><Icon size={18} name="ios-arrow-back"></Icon>back</Text>
          </TouchableOpacity>
      }else{
        return null;
      }
    },
    RightButton:(route,navigator,index,navState) => {
      {return null};  
    },
    Titel : (route,navigator,index,navState) => {
      {return (<Text style={styles.navTitle}>{route.title}</Text>)}
    }

  }

  render(){
    return(
      <Navigator
        initialRoute={{
          title: "30 Days of RN",
          index: 0,
          display: true,
          component: MainView,
        }}
        configureScene={this.configureScene}
        renderScene ={ (route,navigator) => {
          return<route.component navigator={navigator} title={route.title} index={route.index}/>
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flexGrow:1
  },
  mainView:{
    marginTop:Util.maginHight,
  }, 
  navBar:{
    borderBottomWidth:1,
    borderBottomColor:"#ddd"
  },
  navTitle:{
    paddingTop:10,
    fontSize:18,
    fontWeight:"500"
  },
  navBackBtn:{
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 18,
    color: "#555"
  },
  itemWrapper:{
    backgroundColor: "#f3f3f3"
  },
  touchBox:{
    width : width / 3 ,
    height: width / 3 ,
    marginTop:10,
  },
  touchBoxContainer:{
    flexDirection : "row" , 
    flexWrap : "wrap" , 
    width : width,
  },
  touchBox1:{
    borderBottomWidth :  pixel,
    borderBottomColor : '#ccc' ,
    borderRightWidth : pixel,
    borderRightColor : '#ccc'
  },
  touchBox2:{
    borderBottomWidth : pixel , 
    borderBottomColor : '#ccc',
    borderLeftWidth : pixel,
    borderLeftColor : '#ccc'
  },
  boxContainer:{
    alignItems : "center",
    justifyContent : "center",
    width  :width / 3 ,
    height :width / 3  ,
    marginTop:10,
  },
  boxText:{
    position : "absolute" , 
    bottom : 15 , 
    width : width / 3 - 2,
    textAlign : "center" , 
    left : 0,
    backgroundColor : "transparent"
  },
  boxIcon:{
    position : "relative" , 
    resizeMode:'center'
  },
  slide:{
    flexGrow:1,
    height:150,
    justifyContent:"center",
    alignItems:"center",
  },
  slideText:{
    position:"absolute",
    bottom:0,
    paddingTop:5,
    paddingBottom:5,
    backgroundColor:"rgba(255,255,255,0.5)",
    width: width,
    textAlign:"center",
    fontSize:12
  },
  image:{
    width:width,
    flexGrow:1,
    alignSelf:"stretch"
  }
});



