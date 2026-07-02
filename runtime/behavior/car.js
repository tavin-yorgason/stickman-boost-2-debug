cr.behaviors.Car = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Car.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.upkey = false;
		this.downkey = false;
		this.leftkey = false;
		this.rightkey = false;
		this.ignoreInput = false;
		this.simup = false;
		this.simdown = false;
		this.simleft = false;
		this.simright = false;
		this.s = 0;
		this.a = this.inst.angle;
		this.m = this.inst.angle;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.maxspeed = this.properties[0];
		this.acc = this.properties[1];
		this.dec = this.properties[2];
		this.steerSpeed = cr.to_radians(this.properties[3]);
		this.driftRecover = cr.to_radians(this.properties[4]);
		this.friction = this.properties[5];
		this.setAngle = (this.properties[6] === 1);			// 0=no, 1=yes
		this.defaultControls = (this.properties[7] === 1);	// 0=no, 1=yes
		this.enabled = (this.properties[8] !== 0);
		this.lastx = this.inst.x;
		this.lasty = this.inst.y;
		this.lastAngle = this.inst.angle;
		if (this.defaultControls && !this.runtime.isDomFree)
		{
			jQuery(document).keydown(
				(function (self) {
					return function(info) {
						self.onKeyDown(info);
					};
				})(this)
			);
			jQuery(document).keyup(
				(function (self) {
					return function(info) {
						self.onKeyUp(info);
					};
				})(this)
			);
		}
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"ignoreInput": this.ignoreInput,
			"enabled": this.enabled,
			"s": this.s,
			"a": this.a,
			"m": this.m,
			"maxspeed": this.maxspeed,
			"acc": this.acc,
			"dec": this.dec,
			"steerSpeed": this.steerSpeed,
			"driftRecover": this.driftRecover,
			"friction": this.friction,
			"lastx": this.lastx,
			"lasty": this.lasty,
			"lastAngle": this.lastAngle
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.ignoreInput = o["ignoreInput"];
		this.enabled = o["enabled"];
		this.s = o["s"];
		this.a = o["a"];
		this.m = o["m"];
		this.maxspeed = o["maxspeed"];
		this.acc = o["acc"];
		this.dec = o["dec"];
		this.steerSpeed = o["steerSpeed"];
		this.driftRecover = o["driftRecover"];
		this.friction = o["friction"];
		this.lastx = o["lastx"];
		this.lasty = o["lasty"];
		this.lastAngle = o["lastAngle"];
		this.upkey = false;
		this.downkey = false;
		this.leftkey = false;
		this.rightkey = false;
		this.simup = false;
		this.simdown = false;
		this.simleft = false;
		this.simright = false;
	};
	behinstProto.onKeyDown = function (info)
	{
		switch (info.which) {
		case 37:	// left
			info.preventDefault();
			this.leftkey = true;
			break;
		case 38:	// up
			info.preventDefault();
			this.upkey = true;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = true;
			break;
		case 40:	// down
			info.preventDefault();
			this.downkey = true;
			break;
		}
	};
	behinstProto.onKeyUp = function (info)
	{
		switch (info.which) {
		case 37:	// left
			info.preventDefault();
			this.leftkey = false;
			break;
		case 38:	// up
			info.preventDefault();
			this.upkey = false;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = false;
			break;
		case 40:	// down
			info.preventDefault();
			this.downkey = false;
			break;
		}
	};
	behinstProto.onWindowBlur = function ()
	{
		this.upkey = false;
		this.downkey = false;
		this.leftkey = false;
		this.rightkey = false;
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var left = this.leftkey || this.simleft;
		var right = this.rightkey || this.simright;
		var up = this.upkey || this.simup;
		var down = this.downkey || this.simdown;
		this.simleft = false;
		this.simright = false;
		this.simup = false;
		this.simdown = false;
		if (!this.enabled)
			return;
		if (this.setAngle && this.inst.angle !== this.lastAngle)
		{
			this.a = this.inst.angle;
			this.m = this.inst.angle;
			this.lastAngle = this.inst.angle;
		}
		var collobj = this.runtime.testOverlapSolid(this.inst);
		if (collobj)
		{
			this.runtime.registerCollision(this.inst, collobj);
			if (!this.runtime.pushOutSolidNearest(this.inst))
				return;		// must be stuck in solid
		}
		if (this.ignoreInput)
		{
			left = false;
			right = false;
			up = false;
			down = false;
		}
		if (up && !down)
		{
			this.s += this.acc * dt;
			if (this.s > this.maxspeed)
				this.s = this.maxspeed;
		}
		if (down && !up)
		{
			this.s -= this.dec * dt;
			if (this.s < -this.maxspeed)
				this.s = -this.maxspeed;
		}
		if (down === up)
		{
			if (this.s > 0)
			{
				this.s -= this.dec * dt * 0.1;
				if (this.s < 0)
					this.s = 0;
			}
			else if (this.s < 0)
			{
				this.s += this.dec * dt * 0.1;
				if (this.s > 0)
					this.s = 0;
			}
		}
		if (this.s < 0)
		{
			var temp = left;
			left = right;
			right = temp;
		}
		if (left && !right)
		{
			this.a = cr.clamp_angle(this.a - this.steerSpeed * dt * (Math.abs(this.s) / this.maxspeed));
		}
		if (right && !left)
		{
			this.a = cr.clamp_angle(this.a + this.steerSpeed * dt * (Math.abs(this.s) / this.maxspeed));
		}
		var recover = this.driftRecover * dt;
		var diff = cr.angleDiff(this.a, this.m);
		if (diff > cr.to_radians(90))
			recover += (diff - cr.to_radians(90));
		if (diff <= recover)
			this.m = cr.clamp_angle(this.a);
		else if (cr.angleClockwise(this.a, this.m))
			this.m = cr.clamp_angle(this.m + recover);
		else
			this.m = cr.clamp_angle(this.m - recover);
		this.lastx = this.inst.x;
		this.lasty = this.inst.y;
		if (this.s !== 0 && dt !== 0)
		{
			this.inst.x += Math.cos(this.m) * this.s * dt;
			this.inst.y += Math.sin(this.m) * this.s * dt;
			if (this.setAngle)
			{
				this.inst.angle = this.a;
				this.lastAngle = this.a;
			}
			this.inst.set_bbox_changed();
			var hitsolid = this.runtime.testOverlapSolid(this.inst);
			if (hitsolid)
			{
				this.runtime.registerCollision(this.inst, hitsolid);
				this.s = Math.abs(this.s);
				this.m = this.runtime.calculateSolidBounceAngle(this.inst, this.lastx, this.lasty);
				this.inst.x += Math.cos(this.m) * this.s * dt;	// move out for another tick to try and avoid solid
				this.inst.y += Math.sin(this.m) * this.s * dt;
				this.inst.set_bbox_changed();
				this.s *= (1 - this.friction);
				if (!this.runtime.pushOutSolid(this.inst, Math.cos(this.m), Math.sin(this.m), Math.max(this.s * 2.5 * dt, 30)))
					this.runtime.pushOutSolidNearest(this.inst, 100);
			}
		}
		else if (this.setAngle && this.inst.angle !== this.a)
		{
			this.inst.angle = this.a;
			this.lastAngle = this.a;
			this.inst.set_bbox_changed();
			if (this.runtime.testOverlapSolid(this.inst))
				this.runtime.pushOutSolidNearest(this.inst, 100);
		}
	};
	function Cnds() {};
	Cnds.prototype.IsMoving = function ()
	{
		return this.s !== 0;
	};
	Cnds.prototype.CompareSpeed = function (cmp, s)
	{
		return cr.do_cmp(this.s, cmp, s);
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Stop = function ()
	{
		this.s = 0;
	};
	Acts.prototype.SetIgnoreInput = function (ignoring)
	{
		this.ignoreInput = ignoring;
	};
	Acts.prototype.SetSpeed = function (speed)
	{
		if (speed < -this.maxspeed)
			speed = -this.maxspeed;
		if (speed > this.maxspeed)
			speed = this.maxspeed;
		this.s = speed;
	};
	Acts.prototype.SetMaxSpeed = function (maxspeed)
	{
		this.maxspeed = maxspeed;
		if (this.maxspeed < 0)
			this.maxspeed = 0;
	};
	Acts.prototype.SetAcceleration = function (acc)
	{
		this.acc = acc;
		if (this.acc < 0)
			this.acc = 0;
	};
	Acts.prototype.SetDeceleration = function (dec)
	{
		this.dec = dec;
		if (this.dec < 0)
			this.dec = 0;
	};
	Acts.prototype.SimulateControl = function (ctrl)
	{
		switch (ctrl) {
		case 0:		this.simleft = true;	break;
		case 1:		this.simright = true;	break;
		case 2:		this.simup = true;		break;
		case 3:		this.simdown = true;	break;
		}
	};
	Acts.prototype.SetEnabled = function (en)
	{
		this.enabled = (en === 1);
	};
	Acts.prototype.SetSteerSpeed = function (x)
	{
		this.steerSpeed = cr.to_radians(x);
	};
	Acts.prototype.SetDriftRecover = function (x)
	{
		this.driftRecover = cr.to_radians(x);
	};
	Acts.prototype.SetFriction = function (x)
	{
		this.friction = x;
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(this.s);
	};
	Exps.prototype.MaxSpeed = function (ret)
	{
		ret.set_float(this.maxspeed);
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Deceleration = function (ret)
	{
		ret.set_float(this.dec);
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.m));
	};
	Exps.prototype.VectorX = function (ret)
	{
		ret.set_float(Math.cos(this.m) * this.s);
	};
	Exps.prototype.VectorY = function (ret)
	{
		ret.set_float(Math.sin(this.m) * this.s);
	};
	Exps.prototype.SteerSpeed = function (ret)
	{
		ret.set_float(cr.to_degrees(this.steerSpeed));
	};
	Exps.prototype.DriftRecover = function (ret)
	{
		ret.set_float(cr.to_degrees(this.driftRecover));
	};
	Exps.prototype.Friction = function (ret)
	{
		ret.set_float(this.friction);
	};
	behaviorProto.exps = new Exps();
}());
;
;
