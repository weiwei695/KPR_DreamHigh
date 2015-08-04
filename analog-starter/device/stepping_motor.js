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
	motor: { type: "PWM", value: 1 },
	motor_DIR: { type: "Digital", direction: "output" },
	motor_ENA: { type: "Digital", direction: "output" }
}// motor:28, motor_DIR:6, motor_ENA:4

exports.configure = function() {
	this.motor.init();
	this.motor_DIR.init();
	this.motor_ENA.init();
}

exports.motor_rotate = function() {
	this.motor.write(.5);
}

exports.motor_stop = function() {
	this.motor.write( 0 );
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
		this.motor_ENA.write(1);
		sensorUtils.delay(1);	
		flag = 0;
	}
	else
	{
		this.motor_DIR.write(0);
		this.motor_ENA.write(1);
		sensorUtils.delay(1);
		flag = 1;
	}	
}

exports.close = function() {
	this.motor_ENA.write(0);
	this.motor.write( 0 );
	this.motor.close();
	this.motor_DIR.close();
	this.motor_ENA.close();
}