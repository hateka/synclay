var Draw = function(){};

var mouseX,mouseY = 0;

Draw.prototype = {
    set_cvs:function(){
	var canvas = document.getElementById('d');
	//canvas.width = window.innerWidth - 10;
	canvas.height = window.innerHeight - 10;

	var cvc = canvas.getContext('2d');
	cvc.lineWidth = 2;
	cvc.strokeStyle = '#F76060';

	this.cv = canvas;
	this.down = false;
	this.cvsc = cvc;
    },
    now:function(e){
       var rect = e.target.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
     },
    mouse_down:function(){
	var self = this;
	this.cv.addEventListener('mousedown',function(e){
		self.down = true;
              self.now(e);
		self.cvsc.beginPath();
		self.cvsc.moveTo(mouseX,mouseY);
		//alert(e.clientX);
		//self.cvsc.lineTo(e.clientX,e.clientY);
		socket.emit('draw',{
			act:'down',
                                                x:mouseX,
	               	y:mouseY
		});
	},false);
    },
    mouse_move:function(){
	var self = this;

	this.cv.addEventListener('mousemove',function(e){
		if(!self.down){
		    return;
		}
self.now(e);
		//self.cvsc.lineTo(e.clientX,e.clientY);
self.cvsc.lineTo(mouseX,mouseY);
		self.cvsc.stroke();
		socket.emit('draw',{
			act:'move',
                                                x:mouseX,
	               	y:mouseY
		});
	},false);

    },
    mouse_up:function(){
	var self = this;
	this.cv.addEventListener('mouseup',function(e){
		if(!self.down){
		    return;
		}
		//self.cvsc.stroke();
		self.cvsc.closePath();
		self.down = false;
                                $('#message').focus();
		socket.emit('draw',{
			act:'up',
		                x:mouseX,
	               	y:mouseY
                                });
                },false);

    },
    draw_state:function(){
	var mouse_state = false;
	var self = this;

                socket.on('draw',function(d){
			switch(d.act){
			case 'down':
			    mouse_state = true;
			    self.cvsc.beginPath();
			    self.cvsc.moveTo(d.x,d.y);
			    break;
			case 'move':
			    self.cvsc.lineTo(d.x,d.y);
			    self.cvsc.stroke();
			    break;
			case 'up':
			    if(!mouse_state){
				return;
			    }
                                                    self.cvsc.lineTo(d.x,d.y);
			    self.cvsc.stroke();
			    self.cvsc.closePath();
			    mouse_state = false;
			    break;
			}
                });
    }
}
