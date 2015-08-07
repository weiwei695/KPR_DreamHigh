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
	dht11: {type: "Serial", baud: 9600  }
};// motor_PWM:28, motor_DIR:6, motor_ENA:4, TX: 31, RX: 33

exports.configure = function() {
	this.motor_PWM.init();
	this.motor_DIR.init();
	this.motor_ENA.init();
	// initialize the serial port
	this.dht11.init();
	// clear the buffer
    this.dht11.read( "String" );	
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

exports.control_motor = function() {
	
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
}