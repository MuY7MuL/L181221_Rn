/**
 * create by mumu_Arashi
 * 2019-03-05
 * 可以拖动的cell
 */

import React, {Component} from 'react';
import{
    View,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    LayoutAnimation,
    PanResponder,
    Dimensions,
    Text
} from 'react-native';

const { width , height } = Dimensions.get('window');

class DragCell extends Component{
    constructor(){
        super();
        this._width = width/4;     //单元格宽度
        this.topIndex = 0;         //开始点击所在行
        this.leftIndex = 0;        //开始点击所在列
        this.index = 0;            //开始所选cell在数组中的下标
        this.finalTopIndex = 0;    //拖拽结束所在的行
        this.finalLeftIndex = 0;   //拖拽之后所在的列
        this.finalIndex = 0;       //拖拽之后cell在数组中的下标
        this.prev_left = 0;        //cell相对父组件距离left距离
        this.prev_top = 0;         //cell相对父组件距离top距离
        this.left = 0;             //拖拽之后 cell 距离 left 的距离
        this.top = 0;              //拖拽之后 cell 距离 top 的距离
        this.animations = {        //拖动动画
           duration : 200,
           create: {
              type : LayoutAnimation.Types.linear,
              property: LayoutAnimation.Properties.opacity
           } ,
           update:{
              type : LayoutAnimation.Types.linear,
              springDamping : 0.7,
           },
        };
        this.state = {
            selected : 7,
            // cell数据
            cells:[{
                key:0,
                title:"A aaaa",
                icon:require('./images/day1.png'),
                size:48,
                bgColor:"#ff856c",
                hideNav:false,
            },{
                key:1,
                title:"B bbbb",
                icon:require('./images/day2.png'),
                size:48,
                bgColor:"#90bdc1",
                hideNav:false,
            },{
                key:2,
                title:"B bbbb",
                icon:require('./images/day3.png'),
                size:48,
                bgColor:"#ff856c",
                hideNav:false,
            },{
                key:3,
                title:"C cccc",
                icon:require('./images/day4.png'),
                size:48,
                bgColor:"#ff856c",
                hideNav:false,
            },{
                key:4,
                title:"D dddd",
                icon:require('./images/day5.png'),
                size:48,
                bgColor:"#ff856c",
                hideNav:false,
            },{
                key:5,
                title:"E eeee",
                icon:require('./images/day6.png'),
                size:48,
                bgColor:"#ff856c",
                hideNav:false,
            },{
                key:6,
                title:"F ffff",
                icon:require('./images/day7.png'),
                size:48,
                bgColor:"#ff856c",
                hideNav:false,
            },{
                key:7,
                title:"更多",
                icon:require('./images/day8.png'),
                size:48,
                bgColor:"#ff856c",
                hideNav:false,
            }]
        }
        this._release = this._release.bind(this)
        this._endMove = this._endMove.bind(this)
    }

    componentWillMount(){
        //手势添加
        this._panResponder = PanResponder.create({
          //开始触摸手势响应
          onStartShouldSetPanResponder:(evt , gestureState)=>{
              return gestureState.dx !==0 ;
          },
          //手势移动开始前询问是否响应交互
          onMoveShouldSetPanResponder: (evt ,gestureState)=> true,
          //开始手势操作，即点击开始,  
          onPanResponderGrant:(evt,gestureState) => {
            const {pageX,pageY} = evt.nativeEvent;
            this.topIndex = Math.floor((pageY - width*0.3) / this._width);  // 根据坐标Y获取当前所在的行
            this.leftIndex = Math.floor((pageX) / this._width);             // 根据坐标X获取当前所在的列    
            this.index = this.topIndex *4 + this.leftIndex;                 // 根据每行显示的cell个数，已经行，列，计算出cell所在数组的下标
            this.prev_left = this._width * this.leftIndex;                  // cell 距离 left 的距离
            this.prev_top = this._width * this.topIndex;                    // cell 距离 top 的距离
            this.setState({
                selected :  this.index     // 修改 state 的值
            });
            let oneCell = this.refs["cell"+this.index];
            //单元格布局刷新
            oneCell.setNativeProps({
               style : {
                 opacity:0.7,
                 shadowColor :'#000',
                 shadowOpacity: 0.3,
                 shadowRadius : 5,
                 shadowOffset:{
                     height:0,
                     width:2
                 }
               } 
            });
          },
           //最近一次的移动距离 
          onPanResponderMove:(evt, gestureState)=>{
              this.left = this.prev_left + gestureState.dx;      // 拖拽之后 cell 距离 left 的距离
              this.top = this.prev_top + gestureState.dy;        // 拖拽之后 cell 距离 top 的距离
              let oneCell = this.refs["cell"+this.index];
              oneCell.setNativeProps({
                  style:{
                      top : this.top,
                      left : this.left,
                  }
              });
              this._endMove(evt,gestureState)
          },
          //监听到其他来源的触摸点击,拖动监听是否释放
          onPanResponderTerminationRequest:(evt,gestureState)=>true,
          //触摸拖动结束的时候
          onPanResponderRelease: (evt , gestureState) => this._release(evt , gestureState),
          //监听到其他来源的触摸点击,当前拖动停止的时候
          onPanResponderTerminate : (evt , gestureState) => this._release(evt , gestureState),
          //是否阻止原生触摸事件
          onShouldBlockNativeResponder:(event , gestureState) => true,
        })
    }
   
    _endMove(evt,gestureState){
        this.finalTopIndex  = Math.floor(this.top / this._width + 0.5);        // 拖拽之后计算所在 列
        this.finalLeftIndex = Math.floor(this.left /this._width + 0.5);        // 拖拽之后计算所在 行
        //判断是否需要移动
        if((-1 < this.finalTopIndex) && (this.finalTopIndex <5) && (-1 < this.finalLeftIndex) && this.finalLeftIndex <4){
            this.finalIndex = this.finalTopIndex * 4 +this.finalLeftIndex ;
            // 数组数据替换
            let cells = this.state.cells;
            let moveCell =  cells[this.index];
            cells.splice(this.index ,1);
            cells.splice(this.finalIndex , 0 ,moveCell) ; 
            this.setState({
                cells
            })
            if(this.finalIndex != this.index){
                this.index =  this.finalIndex;
                this.setState({
                    selected : this.finalIndex,
                })
            }
            LayoutAnimation.configureNext(this.animations);
        }else{
            LayoutAnimation.configureNext(this.animations);
        }
    }

    _release(evt,gestureState){
        //单元格样式
        const shadowStyle = {
            opacity: 1,
            shadowColor: "#000",
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset:{
                height: 0,
                width: 0,
            }
        };
        if((-1 < this.finalTopIndex) && (this.finalTopIndex < 5) && (-1 < this.finalLeftIndex) && this.finalLeftIndex <4 ){
            let oneCell =  this.refs["cell"+this.finalIndex];
            let top = this.finalTopIndex * this._width;
            let left = this.finalLeftIndex * this._width;
            oneCell.setNativeProps({
                style:{top,left,...shadowStyle},
            });
            LayoutAnimation.configureNext(this.animations);
        }else{
            console.log(this.topIndex,this.leftIndex)
            let oneCell = this.refs["cell" +  this.index];
            let top = this.topIndex * this._width;
            let left = this.leftIndex * this._width;
            oneCell.setNativeProps({
                style :{top,left,...shadowStyle},
            })
            LayoutAnimation.configureNext(this.animations);
        }
    }

    render(){
        const cells = this.state.cells.map((elem , index)=>{
            let top = Math.floor(index /4)* this._width ; 
            let left = (index % 4) * this._width;
            // 单个 cell 布局 ，手势绑定。
            return(
                <View ref={"cell"+index} 
                      {...this._panResponder.panHandlers} 
                      key={elem.key}
                      style={[styles.touchCell,{top,left}]} 
                      underlayColor="#eee">
                    <View style={styles.cellContainer}>
                        <Image style={styles.cellIcon} source={elem.icon}></Image>
                        <Text style={styles.cellTitle}>{elem.title}</Text>
                    </View>
                </View>
            )
        })

        let selectedItem = cells[this.state.selected];
        cells.splice(this.state.selected ,1);
        cells.push(selectedItem);
        return(
            <View style = {styles.touchCellContainer}>
               {cells}
            </View>
        )
    }
}

export default class extends Component{
    static navigationOptions = {
        title: '拖动Cell',
        header: {
        }
    };
    render(){
        return(
        <View style={{flex:1}}>           
            <View style={{height:width*0.3,width:width,backgroundColor:'white'}}>
            </View>
            <DragCell/>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    itemWrapper:{
        backgroundColor:'#f3f3f3'
    },
    touchCell:{
        width : width/4,
        height : width/4,
        backgroundColor:"#fff",
        position:"absolute",
        left:0,
        top:0,
        borderWidth:1,
        borderColor:"#ccc",
    },
    touchCellContainer:{
        width:width ,
    },
    cellContainer:{
        alignItems:"center",
        justifyContent:"center",
        width : width/4,
        height: width/4
    },
    cellIcon :{
        position:"relative",
        top: -10,
        width: width/10,
        height:width/10
    },
    cellTitle:{
        position :"absolute",
        bottom :15,
        width:width/4,
        textAlign:"center",
        left:0,
        backgroundColor:"transparent"
    }
})



