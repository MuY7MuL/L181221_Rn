//
//  CalendarManager.m
//  Amis_Day1
//
//  Created by Mumu on 2019/1/10.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "CalendarManager.h"

#define COUNTDOWN 60
@interface CalendarManager(){
  NSTimer *_timer;        //定时器
  NSInteger countDown;   //倒计时
  NSString *filePath ;
}
@property (nonatomic,strong)AVAudioSession *session;
@property (nonatomic,strong)AVAudioRecorder *recorder;  //录音器
@property (nonatomic,strong)AVAudioPlayer *player;      //播放器
@property (nonatomic,strong)NSURL *recorderFileUrl;     //文件地址
@end

@implementation CalendarManager

-(id)ins{
  static CalendarManager *AVAudioManager = nil;
  static dispatch_once_t onceManager;
  dispatch_once(&onceManager, ^{
    AVAudioManager = [[CalendarManager alloc] init];
  });
  return AVAudioManager;
}

/**
 *    开始录音
 */
-(void)startRecord{
  countDown = 60;
  [self addTimer];
  AVAudioSession *session = [AVAudioSession sharedInstance];
  NSError *sessionError;
  [session setCategory:AVAudioSessionCategoryPlayAndRecord error:&sessionError];
  if(session == nil){
    NSLog(@"Error create session:%@",[sessionError description]);
  }else{
    [session setActive:YES error:nil];
  }
  self.session = session;
  //获取沙盒路径
  NSString *path = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)lastObject];
  filePath = [path stringByAppendingString:@"/AmisAvdio.wav"];
  //获取文件路径
  self.recorderFileUrl = [NSURL fileURLWithPath:filePath];
  //设置参数
  NSDictionary *recordSetting = [[NSDictionary alloc] initWithObjectsAndKeys:
                                 //采样率 8000/11025/22050/44100/96000
                                 [NSNumber numberWithFloat:8000.0],AVSampleRateKey,
                                 //音频格式
                                 [NSNumber numberWithInt:kAudioFormatLinearPCM],AVSampleRateKey,
                                 //采样位数8、16、25、32 默认为16
                                 [NSNumber numberWithInt:16],AVLinearPCMBitDepthKey,
                                 //音频通道数 1 或 2
                                 [NSNumber numberWithInt:1],AVNumberOfChannelsKey,
                                 //录音质量
                                 [NSNumber numberWithInt:AVAudioQualityHigh],AVEncoderAudioQualityKey,
                                 nil];
  //初始化录音器 ，并且读取文件地址
  _recorder=[[AVAudioRecorder alloc] initWithURL:self.recorderFileUrl settings:recordSetting error:nil];
  if(_recorder){
    //计量或者 默认关闭
    _recorder.meteringEnabled = YES;
    //创建文件，
    [_recorder prepareToRecord];
    //启动或者恢复记录文件
    [_recorder record];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(60 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [self stopRecord];
    });
  }else{
    NSLog(@"Error : Can not run");
  }
  
  
}

/**
 *   停止录音
 */
-(void)stopRecord{
  //停止计时器
  [self removeTimer];
  if([self.recorder isRecording]){
    [self.recorder stop];
  }
  NSFileManager *manager = [NSFileManager defaultManager];
  //判断文件路径是否正确
  if([manager fileExistsAtPath:filePath]){
    NSString *logStr = [NSString stringWithFormat:@"已经录制了 %ld 秒，文件大小为 %.2f kb",COUNTDOWN-(long)countDown,[[manager attributesOfItemAtPath:filePath error:nil] fileSize]/1024.0];
    NSLog(@"%@",logStr);
  }else{
    NSLog(@" 超时啦 ~~~~~~");
  }
}

/**
 *  播放录音
 */
-(void)playRecord{
  [self.recorder stop];
  self.player = [[AVAudioPlayer  alloc] initWithContentsOfURL:self.recorderFileUrl error:nil];
  [self.session setCategory:AVAudioSessionCategoryPlayback error:nil];
  [self.player play];
}

/**
 *  添加定时器
 */
-(void)addTimer{
  _timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(refreshSomth) userInfo:nil repeats:YES];
  [[NSRunLoop currentRunLoop] addTimer:_timer forMode:NSRunLoopCommonModes];
}

/**
 *  移除定时器
 */
-(void)removeTimer{
  [_timer invalidate];
  _timer = nil;
}

/**
 *  定时器事件
 */
-(void)refreshSomth{
  countDown--;
  NSLog(@"countDown===========%ld",(long)countDown);
}


@end
