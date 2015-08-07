//@module
exports.pins = {
	dht11: {type: "Serial", baud: 9600 }
};

exports.configure = function(){
	// initialize the dht11 port
	this.dht11.init();
	    // clear the buffer
    this.dht11.read( "String" );	
	//return true; 
}


exports.MCU_command = function(){
	//this.dht11.read( "String" );
	this.dht11.write('12345');
	//sensorUtils.delay(2.4);
	var response = this.dht11.read( "Array", 5, 50 );
	
	return response;
}

exports.close = function(){
	this.dht11.close();
}