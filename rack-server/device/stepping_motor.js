//@module
/*
  Copyright 2011-2014 Marvell Semiconductor, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
exports.pins = {
	motor_PWM: { type: "PWM", value: 1 },
	motor_DIR: { type: "Digital", direction: "output" },
	motor_ENA: { type: "Digital", direction: "output" },
	dht11: {type: "Serial", baud: 9600  },
	arrive_FWD: { type: "Digital", direction: "input" },
	arrive_CW: { type: "Digital", direction: "input" },
	light_sensor: { type: "Digital", direction : "input" }
};// motor_PWM:28, motor_DIR:6, motor_ENA:4, TX: 31, RX: 33, arrive_FWD(正转到位信号): 51, arrive_CW(反转到位信号): 52, light_sensor: 53

exports.configure = function() {
	this.motor_PWM.init();
	this.motor_DIR.init();
	this.motor_ENA.init();
	// initialize the serial port
	this.dht11.init();
	// clear the buffer
    this.dht11.read( "String" );
    this.arrive_FWD.init();
    this.arrive_CW.init();	
    this.light_sensor.init();
}

exports.digitalread = function() {
	return this.arrive_FWD.read();
}

exports.motor_PWM_turnon = function() {
	this.motor_PWM.write(.5);
}

exports.motor_PWM_turnoff = function() {
	this.motor_PWM.write( 0 );
}

exports.motor_DIR_FWD = function() {
	this.motor_DIR.write(1);
}

exports.motor_DIR_CW = function() {
	this.motor_DIR.write(0);
}

exports.motor_ENA_turnon = function() {
	this.motor_ENA.write(1);
}

exports.motor_ENA_turnoff = function() {
	this.motor_ENA.write(0);
}

var flag = 0;
exports.start_stepping_motor = function() {
	if( flag )
	{
		this.motor_DIR.write(1);
		//this.motor_ENA.write(1);
		sensorUtils.delay(1);	
		flag = 0;
	}
	else
	{
		this.motor_DIR.write(0);
		//this.motor_ENA.write(1);
		sensorUtils.delay(1);
		flag = 1;
	}	
}

var hanger_flag = 1, humidity_80, humidity_60, humidity;
var modestate = 1, rackaction;//模式（自动、手动），动作（按键：收衣、晒衣）。首先进入自动（目的为了同步数据）
exports.modestate_on = function() {
	modestate = 1;
}

exports.modestate_off = function() {
	modestate = 0;
}

exports.rackaction_on = function() {
	rackaction = 1;
}

exports.control_motor = function( ) {

	this.dht11.write("12345");//发送响应信号
	var response = this.dht11.read( "Array", 5, 50);
	humidity = response[0];
	
	if ( modestate )//自动模式modestate==1
	{//trace(1);
		if ( humidity > 80 )//收衣服
		{
			humidity_80 = 1;
			humidity_60 = 0;
			hanger_flag = 1;//'1'表示正在收衣服，下一个状态是晒衣服
			if ( this.arrive_FWD.read() == 1 )//电机到位信号为低电平
			{
				this.motor_DIR.write(0);//收衣服
				this.motor_ENA.write(1);//打开使能			
			}
			else
			{
				this.motor_ENA.write(0);//关闭使能
				humidity_80 = 0;
			}
		}
		if ( humidity < 60 )//晒衣服
		{
			humidity_60 = 1;
			humidity_80 = 0;
			hanger_flag = 0;//'0'表示正在晒衣服，下一个状态是收衣服
			if ( this.arrive_CW.read() == 1 )//电机到位信号为低电平
			{
				this.motor_DIR.write(1);//晒衣服
				this.motor_ENA.write(1);//打开使能		
			}
			else
			{
				this.motor_ENA.write(0);//关闭使能
				humidity_60 = 0;
			}
		}
		if ( humidity >= 60 && humidity <= 80 )//保持上一个状态
		{
			if ( humidity_80 )
			{
				if ( this.arrive_FWD.read() == 1 )//电机到位信号为低电平
				{
					this.motor_DIR.write(0);//收衣服
					this.motor_ENA.write(1);//打开使能
					//hanger_flag = 1;//'1'表示正在收衣服，下一个状态是晒衣服
				}
				else
				{
					this.motor_ENA.write(0);//关闭使能
					humidity_80 = 0;
				}				
			}
			if ( humidity_60 )
			{
				if ( this.arrive_CW.read() == 1 )//电机到位信号为低电平
				{
					this.motor_DIR.write(1);//晒衣服
					this.motor_ENA.write(1);//打开使能
					//hanger_flag = 0;//'0'表示正在晒衣服，下一个状态是收衣服
				}
				else
				{
					this.motor_ENA.write(0);//关闭使能
					humidity_60 = 0;
				}				
			}
		}
	}
	else//手动模式modestate==0
	{
		if ( rackaction )//当rackaction==1时，进入手动动作。
		{//trace(3);
			if ( hanger_flag )//hanger_flag==1,表示
			{
			//trace(this.arrive_CW.read());
			//trace(2);
				if ( this.arrive_CW.read() == 1 )//电机到位信号为低电平
				{
					this.motor_DIR.write(1);//晒衣服
					this.motor_ENA.write(1);//打开使能
				}
				else
				{
					this.motor_ENA.write(0);//关闭使能
					hanger_flag = 0;//'0'表示正在晒衣服，下一个状态是收衣服
					rackaction = 0;
				}			
			}
			else
			{
			//trace(1);
		//	trace(this.arrive_FWD.read());
				if ( this.arrive_FWD.read() == 1 )//电机到位信号为低电平
				{
					this.motor_DIR.write(0);//收衣服
					this.motor_ENA.write(1);//打开使能
				}
				else
				{
					this.motor_ENA.write(0);//关闭使能
					hanger_flag = 1;//'1'表示正在收衣服，下一个状态是晒衣服
					rackaction = 0;
				}			
			}
		}
	}
	
	return{RHData: response[0], TData: response[2], H_flag: hanger_flag };//分别为湿度值，温度值， 衣架状态（1：晒衣服，0：收衣服）
}

exports.MCU_command = function(){
	this.dht11.write('12345');
	var response = this.dht11.read( "Array", 5, 50 );	
	return response;
}//serial control

exports.close = function() {
	this.motor_ENA.write(0);
	this.motor_PWM.write(0);
	this.motor_PWM.close();
	this.motor_DIR.close();
	this.motor_ENA.close();
	this.dht11.close();
	this.arrive_FWD.close();
    this.arrive_CW.close();
    this.light_sensor.close();
}
