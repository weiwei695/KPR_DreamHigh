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
    dht11: {type: "Digital", direction: "output"}
};

exports.configure = function() {
    this.dht11.init();
    sensorUtils.delay(1);
    this.dht11.write(1);
}

exports.read = function(){
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
	this.dht11.init();

	//return {RHData: RHData_H, TData: TData_H};
	return this.dht11.read();
}

/*exports.turnOn = function() {
    this.dht11.write(	1 );
}
		
exports.turnOff = function() {
    this.dht11.write( 0 );
}*/

	/////////global var
	var TData_H_temp,TData_L_temp,RHData_H_temp,RHData_L_temp,CheckData_temp,checktemp;
	var presence = 0;
	var count = 0, count1 = 0;
	var RHData_H = 0, TData_H = 0;
	var NUMBER = 30;
	/////////
	
exports.start_DHT11 = function() {
	trace("start_DHT11\n");
	/////////////////////////设置为输出
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
	this.dht11.init();
	/////////////////////////
	
	this.dht11.write(1);
	sensorUtils.udelay(1);
	this.dht11.write(0);//拉低数据线大于18ms，发送开始信号
	sensorUtils.mdelay(19);//需要大于18毫秒
	this.dht11.write(1);//释放数据线，用于检测低电平的应答信号
	sensorUtils.udelay(30);//延时20-40us	，等待一段时间后，检测应答信号，应答信号是从机拉低数据线80us
		
	/////////////////////////设置为输入
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
	this.dht11.init();
	/////////////////////////
	
	//presence = this.dht11.read();
	//trace( presence+"\n");
	count = 0;
	while( !this.dht11.read() && count++ < NUMBER )//等待应答信号结束
	{
		presence = 1;
	}
	trace( presence+"\n");
	if( count >= NUMBER ) //检测计数器是否超过了设定的范围
	{
		/////////////////////////设置为输出
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
		this.dht11.init();
		/////////////////////////		
			
		this.dht11.write(1);
		return{RHData: 0, TData: 0};//退出函数
	}
	while( this.dht11.read() && count++ << NUMBER );//应答信号后会有一个80us的高电平。等待高电平结束
	if( count >= NUMBER )
	{
		/////////////////////////设置为输出
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
		this.dht11.init();
		/////////////////////////		
			
		this.dht11.write(1);
		return{RHData: 0, TData: 0};//退出函数				
	}
	if( presence )
	{
		trace("presence\n");
		count = 0;
/*		while( !this.dht11.read() && count++ < NUMBER );//等待应答信号结束
		if( count >= NUMBER ) //检测计数器是否超过了设定的范围
		{
			/////////////////////////设置为输出
			this.dht11.close();
			this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
			this.dht11.init();
			/////////////////////////		
			
			this.dht11.write(1);
			return{RHData: 0, TData: 0};//退出函数
		}
		count = 0;*/
		
/*		/////////////////////////设置为输出
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
		this.dht11.init();
		/////////////////////////
		
		this.dht11.write(1);//释放数据线
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////		
*/			
/*		while( this.dht11.read() && count++ << NUMBER );//应答信号后会有一个80us的高电平。等待高电平结束
		if( count >= NUMBER )
		{
			/////////////////////////设置为输出
			this.dht11.close();
			this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
			this.dht11.init();
			/////////////////////////		
			
			this.dht11.write(1);
			return{RHData: 0, TData: 0};//退出函数				
		}
*/		
		var dat = 0, i = 0;
		trace("tian\n");
		//////////////////////////////////读取高八位湿度值RHData_H_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming1\n");
		//	dat = dat << 1;//高位在先
			count = 0;
				
/*			/////////////////////////设置为输入
			this.dht11.close();
			this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
			this.dht11.init();
			/////////////////////////	
*/					
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(3);//延时30us后检测数据线是否还是高电平
			while( this.dht11.read() && count++ < NUMBER )
			{
				count1++;
			}
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};	
			dat = dat << 1;		
			if( count1 > 5 )
				dat = dat | 0x01;
			else
				dat = dat & 0xfe;
			count1 = 0;
			sensorUtils.udelay(3);
/*			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				trace("dat = "+ dat + "\n");
				count = 0;
				while( this.dht11.read() && count++ < NUMBER );//等待剩余 (约40us)的高电平结束
/*				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);
					
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
					this.dht11.init();
					/////////////////////////														
				}	
*/
/*				trace("count = " + count + "\n");	
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}*/
		}
		RHData_H_temp = dat;
		trace("RHData_H_temp = " + dat + "\n");
		dat = 0;
		//////////////////////////////////
		
		//////////////////////////////////读取第八位湿度值RHData_L_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming2\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		RHData_L_temp = dat;	
		dat = 0;
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
			
		//////////////////////////////////
		
		//////////////////////////////////读取高八位温度值TData_H_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming3\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		TData_H_temp = dat;	
		dat = 0;
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
					
		//////////////////////////////////
		
		//////////////////////////////////读取第八位温度值TData_L_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming4\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		TData_L_temp = dat;	
		dat = 0;
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
							
		//////////////////////////////////
		
		//////////////////////////////////读取校验值CheckData_temp = DHT11_ReadChar();
		for(i = 0; i < 8; i++)
		{
			trace("ming4\n");
			dat = dat << 1;//高位在先
			count = 0;
			while( !this.dht11.read() && count++ < NUMBER );//每一位数据前会有一个50us的低电平时间，等待50us低电平结束
			if( count >= NUMBER )
				return{RHData: 0, TData: 0};//函数执行过程发生错误就退出函数
			//26-28us的高电平表示该位是0，为70us高电平表示该位是1
			sensorUtils.udelay(30);//延时30us后检测数据线是否还是高电平
			dat = dat << 1;//50us低电平+28us高电平表示'0'
			if( this.dht11.read() )
			{
				dat++;//进入这里表示该位是1
				while( this.dht11.read() && count++ < NUMBER )//等待剩余 (约40us)的高电平结束
				{
					/////////////////////////设置为输出
					this.dht11.close();
					this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
					this.dht11.init();
					/////////////////////////		
			
					this.dht11.write(1);					
				}
				if( count >= NUMBER )
					return{RHData: 0, TData: 0};
			}
		}
		CheckData_temp = dat;	
		dat = 0;	
		
		/////////////////////////设置为输入
		this.dht11.close();
		this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "input"});
		this.dht11.init();
		/////////////////////////
				
		//////////////////////////////////
	}
	else
	{
		return{RHData: 0, TData: 0};
	}
	//////////////////////////////设置端口输出
	this.dht11.close();
	this.dht11 = PINS.create({type: "Digital", pin: 52, direction: "output"});
	this.dht11.init();
	//////////////////////////////
	
	this.dht11.write(1);
	return{RHData: RHData_H_temp, TData: TData_H_temp};
}

exports.close = function() {
	this.dht11.close();
}