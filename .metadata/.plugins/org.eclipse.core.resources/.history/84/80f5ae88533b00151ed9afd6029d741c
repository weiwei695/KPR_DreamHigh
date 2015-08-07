//@module
exports.pins = {
	serial: {type: "Serial", baud: 9600  }
};

exports.configure = function(){
	// initialize the serial port
	this.serial.init();
}

exports.read = function(){
	this.serial.read( "String" );
}

exports.write = function(){
	this.serial.write(0x01);
}

exports.close = function(){
	this.serial.close();
}