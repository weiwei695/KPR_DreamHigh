/*
 *  Copyright 2015 Will Dimmit <will@ultimatetrip.net>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 
 /* Inspired by "bargraph.js" by William Malone (www.williammalone.com) */
 
exports.chart = function(width, height) {
	this.options = options;
 	var options;
 	var currentData;
 	
 	this.LineGraph = function(ctx, options) {
		var primaryColor = 'black';
		
		this.draw = function(data) {
			this.currentData = data;		
			var prevX = 0;
			var prevY = 0;
			var maxDataValue = this.getMaxDataValue(data);
			var lineHeight = (height / maxDataValue);
			var xInterval = this.getXInterval(data, width);
			
			/* Handle Options*/
			if ('background' in options )
				ctx.fillStyle = options.background;
			else 
				ctx.fillStyle = '#999999';
			if ('primaryColor' in options ) 
				primaryColor = options.primaryColor;
				
			/* Draw the background*/
			ctx.fillRect(0,0,width,height);		
			/* Itterate through the data and draw the line */
			for (var i = 0; i < data.length; i++) {
			    var pt = data[i];
			    var ptY = (maxDataValue - pt) * lineHeight;
			    var ptX = (i * xInterval);
			    
			    /* If we're not on the first point, connect the line! */
			    if (i > 0) {
			        this.drawLine(ptX, ptY, prevX, prevY, primaryColor, 2);
			    }
			
			    prevX = ptX;
			    prevY = ptY;
			}		
		
		
		}
		this.getMaxDataValue = function (data) {
			var max = 0;
			for (var i = 0; i < data.length; i++) {
			    if (data[i] > max) 
			    	    max = data[i];
			}
			return max;
		};
		
		this.getXInterval = function(data,width) {
			return Math.round(width / (data.length - 1));
		};
		
		this.drawLine = function(startX, startY, endX, endY, strokeStyle, lineWidth) {
			if (strokeStyle != null) ctx.strokeStyle = strokeStyle;
			if (lineWidth != null) ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.stroke();
			ctx.closePath();
		};
		this.refresh = function(data) {
			if (currentData != data)
				this.draw(data);		
			else
				return;
		}
 	}
 	
 	this.BarGraph = function(ctx, options) {
		this.options = options;
		this.draw = function(data) {
			this.currentData = data;

			var barCount = data.length;
			var barWidth;
			var barHeight;
			var maxBarHeight = height;
			var marginWidth = 0;
			var fillColor = '#ff0000';
			var backgroundColor = '#ffffff';
			var skipBars = 1;
		 	var dataMax = 50;
		 	var dataMin = 0;
		 	
		 	
			/*Setup Defaults*/
			if ('background' in options )
				ctx.fillStyle = options.background;
			if ('marginWidth' in options)
				marginWidth = options.marginWidth;
			if ('dataMax' in options)
				dataMax = options.dataMax
			if ('dataMin' in options)
				dataMin = options.dataMin
			if ('skipBars' in options)
				skipBars = options.skipBars
			
			/*Draw the background*/
			ctx.fillRect(0,0,width,height);
				
			/*Bar Dimensions*/
			barCount = barCount / options.skipBars;
			barWidth = (width / barCount) - (marginWidth * 2);
			
			if ('primaryColor' in options ) 
				ctx.fillStyle = options.primaryColor;
			
			/*Draw the Bars*/
			for (i = 0; i < data.length; i++) {
				if (i%skipBars != 0)
					continue;	
			
				var ratio = (data[i] - dataMin) / dataMax;
				barHeight = ratio * maxBarHeight;
				
				if (barHeight > 0) {
					ctx.fillRect(marginWidth + i * width / barCount,
							  height - barHeight, barWidth, barHeight);
				}
			}
		}
		
		this.refresh = function(data) {
			if (currentData != data)
				this.draw(data);		
			else
				return;
		}
	}
 	this.FastBarGraph = function(options) {
		this.options = options;

		this.draw = function(port, data) {
			this.currentData = data;

			var barCount = data.length;
			var barWidth;
			var barHeight;
			var maxBarHeight = height;
			var marginWidth = 0;
			var fillColor = '#ff0000';
			var backgroundColor = '#ffffff';
			var skipBars = 1;
		 	var dataMax = 1;
		 	var dataMin = 0;
			
			/*Setup Defaults*/
			if ('background)' in options )
				backgroundColor = options.background;
			if ('marginWidth' in options)
				marginWidth = options.marginWidth;
			if ('primaryColor' in options ) 
				fillColor = options.primaryColor;
			if ('dataMax' in options)
				dataMax = options.dataMax
			if ('dataMin' in options)
				dataMin = options.dataMin
			if ('skipBars' in options)
				skipBars = options.skipBars
			
			/*Draw the background*/
			port.fillColor(backgroundColor,0,0,width,height);
			
			/*Bar Dimensions*/
			barCount = barCount / options.skipBars;
			barWidth = (width / barCount) - (marginWidth * 2);
			
			/*Draw the Bars*/
			for (i = 0; i < data.length; i++) {
				if (i%skipBars != 0)
					continue;		
				var ratio = (data[i] - dataMin) / dataMax;
				barHeight = ratio * maxBarHeight;
				
				if (barHeight > 0) {							
					port.fillColor(fillColor, (marginWidth + (i / skipBars)* width) / barCount,
							  height - barHeight, barWidth, barHeight);				
				}
			}
		}
		
		this.refresh = function(port, data) {
			if (currentData != data)
				this.draw(port, data);
			else {
				trace("Not Refreshing - Same Data\n");
				return;
			}
		}
	}
 
}