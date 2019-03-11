/*
*    create by mumu_ly   
*    2019-0107
*    react_native_map
*/

import React, {Component} from 'react';
import{
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableHighlight,
} from 'react-native';

import Utils from './utils';
import Icons from 'react-native-vector-icons/Ionicons';
// import MapView from 'react-native-maps'
import PropTypes from 'prop-types';


 class Maptt extends Component{
    static defaultProps = {
       mapType : 'standard',
       showsUserLocation : false,
       followUserLoaction : false,
    };

    static propTypes = {
        mapType:PropTypes.oneOf(['standard','satellite','hybrid']),
        mapStyle : PropTypes.objectOf,
        showsUserLocation : PropTypes.bool,
        followUserLoaction : PropTypes.bool,
    };

    constructor(props){
        super(props);
        this.state ={
            isFirstLoad: true,
            mapRegion : undefined,
            annotation:[],
        }
    }

    _getAnnottations(region){
        return [{
            longitude : region.longitude,
            latitude : region.latitude,
            title : "You are here",
        }]
    }

    _onRegionChangeComplete(region){
        if(this.state.isFirstLoad){
            this.setState({
                annotation : this._getAnnottations(region),
                isFirstLoad: false,
            })
        }
    }

    render(){
        return(
            <View>
             {/* <MapView
                 style={this.props.mapStyle}
                 mapStyle = {this.props.mapType}
                 showsUserLocation = {this.props.showsUserLocation}
                 followUserLocation = {this.props.followUserLoaction}
                 onRegionChangeComplete = {(region)=>this._onRegionChangeComplete(region)}
                 region = {this.state.mapRegion}
                 annotations = {this.state.annotation}
                >
                </MapView> */}
            </View>
        )
    }


}

export default class extends Component{
    constructor(){
        super();
        this.state={
            showGeo:false
        }
    }

    componentDidMount(){
        if(Platform.OS=== 'ios'){
           StatusBar.setBarStyle(0) 
        }
    }

    _getLocation(){
        this.setState({
            showGeo:true
        })
    }

    render(){
        return(
            <View style={styles.container}> 
                {/* <Maptt mapType="standard"
                     mapStyle={styles.map}
                     showsUserLocation={this.state.showGeo}
                     followUserLoaction={this.state.showGeo}></Maptt> */}
                <Maptt></Maptt>
                <TouchableHighlight style={styles.btn}
                    underlayColor="#00bd03"
                    onPress={()=>this._getLocation}>
                    <Text style={styles.btnText}>
                        <Icons size={18} name="md-navigate"></Icons>
                        Find my Loaction
                    </Text>
                </TouchableHighlight>     
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        alignContent:'center',
        paddingTop:60,  
    },
    map:{
        width:Utils.size.width,
        height : Utils.size.height - 120,
    },
    btn:{
        backgroundColor:'#00a803',
        width : Utils.size.width -80,
        height:40,
        borderWidth:Utils.pixel,
        borderColor:'#009302',
        borderRadius:4,
        justifyContent:"center",
        marginTop:10
    },
    btnText:{
        textAlign:'center',
        fontSize:18,
        color:'#fff'
    }
})



