/**
 * create by mumu
 * progress
 * 2018-11-15 10:51  计时器
 * 
 */

 import React , {Component} from 'react' 
 import PropTypes from 'prop-types'
 import{
     View,
     Platform,
     StyleSheet,
     Text,
     TouchableHighlight,
     ListView,
     Alert
 } from 'react-native'
 import Util from './utils'

 class WatchFace extends Component{
    static propTypes = {
        sectionTime:PropTypes.string,
        totalTime:PropTypes.string,
    }
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={styles.watchFaceContainer}>
                <Text style={styles.sectionTime}>{this.props.sectionTime}</Text>
                <Text style={styles.totalTime}>{this.props.totalTime}</Text>
            </View>
        )
    }
 }

 class WatchControl extends Component {
    static propTypes={
        stopWatch : PropTypes.func,
        clearRecord : PropTypes.func,
        startWatch : PropTypes.func,
        addRecord : PropTypes.func ,
    }

    constructor(props){
        super(props);
        this.state = {
            watchOn : false,
            startBtnText:"启动",
            startBtnColor:'#60B644',
            stopBtnText:"计次",
            underlayColor:"#fff",
        }
    }

    _startWatch(){
        if(!this.state.watchOn){
            this.props.startWatch()
            this.setState({
                startBtnText: "停止" ,
                startBtnColor: "#ff0044" ,
                stopBtnText:"计次",
                underlayColor:"#eee",
                watchOn : true
            })
        }else{
            this.props.stopWatch()
            this.setState({
                startBtnText:"开始",
                startBtnColor:"#60B633",
                stopBtnText:"还原",
                underlayColor:'#eee',
                watchOn:false
            })
        }
    }

    _addRecord(){
        if(this.state.watchOn){
            this.props.addRecord()
        }else{
            this.props.clearRecord()
            this.setState({
                stopBtnText:"计次"
            })
        }
    }

    render(){
        return(
            <View style={styles.watchControlContainer}>
                <View style={{flex:1 ,alignItems:"flex-start"}}>
                    <TouchableHighlight style={styles.btnStop} underlayColor={this.state.underlayColor} onPress={()=>this._addRecord()}>
                        <Text style={styles.btnStopText}>
                            {this.state.stopBtnText}
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={{flex:1 ,alignItems:"flex-end"}}>
                    <TouchableHighlight style={styles.btnStart} underlayColor="#eee" onPress={()=>this._startWatch()}>
                        <Text style={[styles.btnStartText,{color:this.state.startBtnColor}]}>
                            {this.state.startBtnText}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

 }

 class WacthRecord extends Component {
    static propTypes ={
        record:PropTypes.array
    }

    render(){
        let ds = new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2}),
        theDataSource = ds.cloneWithRows(this.props.record);
        return(
            <ListView
               style={styles.recordList}
               dataSource = {theDataSource}
               renderRow={(rowData)=>
                <View style={styles.recordItem}>
                    <Text style={styles.recordItemTitle}>{rowData.title}</Text>
                    <View style={{alignItems:"center"}}>
                        <Text style={styles.recordItemTime}>{rowData.time}</Text>
                    </View>
                </View>}/>
        )
    }

 }
 export default class extends Component{
     constructor(){
         super();
         this.state={
             stopWatch:false,
             resetWatch: true ,
             intialTime:0,
             currentTime:0,
             recordTime:0,
             timeAccumulation:0,
             totalTime:"00:00:00",
             sectionTime:"00:00:00",
             recordCounter:0,
             record:[
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
             ]
         }
     }

     componentwillmount(){
         this._stopWatch();
         this._clearWatch();
     }

     componentDidMount(){

     }

     _startWatch(){
        if(this.state.resetWatch){
            this.setState({
                stopWatch: false,
                resetWatch: false,
                timeAccumulation:0,
                intialTime:(new Date()).getTime()
            })
        }else{
            this.setState({
                stopWatch:false,
                intialTime:(new Date()).getTime()
            })
        }
        let milSecond,second,minute,countingTime,secmilSecond,secsecond,secminute,seccounttingTime;
        let interval = setInterval(
            ()=>{
                this.setState({
                    currentTime:(new Date()).getTime()
                })
                countingTime = this.state.timeAccumulation + this.state.currentTime -this.state.intialTime
                minute = Math.floor(countingTime / (60*1000));
                second = Math.floor((countingTime - 6000*minute)/100);
                milSecond = Math.floor((countingTime%1000)/10);
                seccounttingTime = countingTime - this.state.recordTime;
                secminute = Math.floor(seccounttingTime/(60*1000));
                secsecond = Math.floor((seccounttingTime - 6000*secminute)/1000);
                secmilSecond = Math.floor((seccounttingTime%1000)/10);
               let resultTotalTime = (minute<10 ? "0"+minute : minute )+":"+(second<10 ? "0"+second : second)+"."+(milSecond<10 ? "0"+milSecond : milSecond)
                this.setState({
                    totalTime:resultTotalTime,
                    sectionTime : (secminute<10?"0"+secminute:secminute)+":"+(secsecond<10?"0"+secsecond:secsecond)+"."+(secmilSecond<10?"0"+secmilSecond:secmilSecond)
                })
                if(this.state.stopWatch){
                    this.setState({
                        timeAccumulation:countingTime
                    })
                    clearInterval(interval)
                }
            },10)
    }

     _stopWatch(){
        this.setState({
            stopWatch:true
        })
     }

     _addRecord(){
        let {recordCounter,record} = this.state;
        recordCounter++;
        if(recordCounter<8) {
            record.pop();
        }
        record.unshift({title:"计次"+recordCounter,time:this.state.sectionTime});
        this.setState({
            recordTime:this.state.timeAccumulation+this.state.currentTime - this.state.intialTime,
            recordCounter:recordCounter,
            record:record
        })
     }

     _clearRecord(){
        this.setState({
            stopWatch:false,
            resetWatch:true,
            intialTime:0,
            currentTime:0,
            recordItem:0,
            timeAccumulation:0,
            totalTime:"00:00:00",
            sectionTime:"00:00:00",
            recordCounter:0,
            record:[
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
                {title:"",time:""},
            ]
        })
     }

     render(){
         return(
             <View style={styles.watchContainer}>
                <TouchableHighlight onPress={()=>{
                    
                }}>
                    <View style={{width:100 ,height:100, backgroundColor:'#00ffff'}}>
                    </View>
                </TouchableHighlight>

                <WatchFace totalTime={this.state.totalTime} sectionTime={this.state.sectionTime}></WatchFace>
                <WatchControl addRecord={()=>this._addRecord()}
                clearRecord={()=> this._clearRecord()}
                startWatch={()=>this._startWatch()}
                stopWatch={()=>this._stopWatch()}></WatchControl>
                <WacthRecord record = {this.state.record}></WacthRecord>
             </View>
         )
     }

 }

 const styles = StyleSheet.create({
    watchContainer:{
        alignItems:'center',
        backgroundColor:'#f3f3f3',
        marginTop:60,
    },
    watchFaceContainer:{
        width:Util.width,
        paddingTop:50,
        paddingLeft: 30 , 
        paddingRight : 30 , 
        paddingBottom : 40 ,
        backgroundColor:'#fff',
        borderBottomWidth : 1,
        borderBottomColor :'#ddd',
        height : 170 , 
    },
    sectionTime:{
        fontSize : 20 , 
        fontWeight : "100" ,
        paddingRight : 30 ,
        color:"#555",
        position : "absolute" , 
        left : Util.width - 140 ,
        top:30,
    },
    totalTime:{
        fontSize: Util.width ===375? 70:60,
        fontWeight:"100",
        color:'#222',
        paddingLeft:20
    },
    watchControlContainer:{
        width:Util.width , 
        height:100,
        flexDirection:"row",
        backgroundColor:'#f3f3f3',
        paddingTop:30,
        paddingLeft:60,
        paddingRight:60,
        paddingBottom:0,
    },
    btnStart:{
        width:70,
        height:70,
        borderRadius:35,
        backgroundColor:'#fff',
        alignItems:"center",
        justifyContent:"center",
    },
    btnStop:{
        width:70,
        height:70,
        borderRadius:35,
        backgroundColor:'#fff',
        alignItems:"center",
        justifyContent:"center"
    },
    btnStartText:{
        fontSize:14,
        backgroundColor:"transparent"
    },
    btnStopText:{
        fontSize:14,
        backgroundColor:"transparent",
        color:'#555'
    },
    recordList:{
        width:Util.width,
        height:Util.height-300,
        paddingLeft:15
    },
    recordItem:{
        height:40,
        borderBottomWidth : Util.pixel,
        borderBottomColor:'#bbb',
        paddingTop:5,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:5,
        flexDirection:"row",
        alignItems:"center"
    },
    recordItemTitle:{
        backgroundColor:"transparent",
        flex:1,
        textAlign:"left",
        paddingLeft:20,
        color:'#777'
    },
    recordItemTime:{
        backgroundColor:"transparent",
        flex:1,
        textAlign:"right",
        paddingRight:20,
        color:"#222"
    }

 })
