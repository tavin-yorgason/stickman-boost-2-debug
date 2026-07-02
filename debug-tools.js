window.debug =
{
	hitboxes: false,
	hitboxLabels: false,
	zoomMultiplier: 1.0,
}

window.addEventListener("keydown", function (e)
{
    switch (e.code)
	{
        case "F2":
            debug.hitboxes = !debug.hitboxes;
			console.log("Hitboxes: " + debug.hitboxes);
            break;
        case "F3":
            debug.hitboxLabels = !debug.hitboxLabels;
			console.log("Hitbox labels: " + debug.hitboxLabels);
            break;
		case "Digit0":
			debug.zoomMultiplier = 1.0;
			UpdateZoom(1);
			console.log("Zoom multiplier: " + debug.zoomMultiplier);
			break;
		case "Minus":
			debug.zoomMultiplier = 0.9;
			UpdateZoom();
			console.log("Zoom multiplier: " + debug.zoomMultiplier);
			break;
		case "Equal":
			debug.zoomMultiplier = 1.1;
			UpdateZoom();
			console.log("Zoom multiplier: " + debug.zoomMultiplier);
			break;
    }
});

function UpdateZoom(s = -1)
{
	var rt = cr_getC2Runtime();
	
	if (!rt.running_layout)
		return;

	if (s !== -1)
	{
		rt.running_layout.scale = s;
	}
	else
	{
		rt.running_layout.scale *= debug.zoomMultiplier;
	}

	rt.running_layout.boundScrolling();
	rt.redraw = true;
}

// Shows the current scale if it's not the default value.
function AddZoomScaleText(caller, scale)
{
	caller.ctx.save();

    caller.ctx.font = "24px monospace";
    caller.ctx.textAlign = "right";
    caller.ctx.textBaseline = "bottom";

    // Black outline
    caller.ctx.lineWidth = 3;
    caller.ctx.strokeStyle = "black";

    // White text
    caller.ctx.fillStyle = "white";

    var text = scale == 1 ? "" : "Zoom: " + scale.toFixed(2);

    caller.ctx.strokeText(text, caller.width - 10, caller.height - 10);
    caller.ctx.fillText(text, caller.width - 10, caller.height - 10);

    caller.ctx.restore();
}

function drawAllHitboxes(ctx, instances)
{
	for (i = 0, len = instances.length; i < len; i++)
	{
		drawHitbox(ctx, instances[i]);
	}
}

function shouldDrawHitbox(inst)
{
	if (!debug.hitboxes)
		return false;

	var blockedTypes = 
	[
		't164', // player walking animation
		't166', // player jetpack location
		't174', // coin collect animation
		't175', // broken pieces
		't180', // something on the player
		't181', // something on the player
		't182', // something on the player
		't183', // player dying
		't187', // broken pieces
		't190', // BOOST text
		't198', // level directions
		't219', // motorcycle animation
		't220', // footstep animation
		't230', // explosion animation
		't237', // flamethrower animation
		't243', // camera
		't246', // level directions
		't247', // level directions
		't249', // black filler thing
		't250', // level directions
	];

	var blockedLayers =
	[
		'background',
		'ui',
		'rightpanel', // some ui stuff
		'levelspage',
		'menu',
		'layer 0',    // the loading screen layer
	];

	var typeName = inst.type && inst.type.name.toLowerCase() || "";
	var layerName = inst.layer && inst.layer.name.toLowerCase() || "";

	for (var i = 0; i < blockedTypes.length; i++)
	{
		if (typeName.includes(blockedTypes[i]))
			return false;
	}

	for (var i = 0; i < blockedLayers.length; i++)
	{
		if (layerName.includes(blockedLayers[i]))
			return false;
	}

	return true;
}

function getPlayerSolidState(inst)
{
	if (!inst.collisionsEnabled) return "disabled";

	if (inst.extra && inst.extra["solidEnabled"])
		return "solid";

	return "pass";
}

function setHitboxDrawState(ctx, inst)
{
	// Color code hitboxes
	var state = getPlayerSolidState(inst);
	if (state === "solid")
		ctx.strokeStyle = "cyan";  // player cannot pass
	else if (state === "pass")
		ctx.strokeStyle = "lime";   // player can pass through
	else if (state === "disabled")
		ctx.strokeStyle = "gray";

	ctx.lineWidth = 1;

	// Special cases
	var typeName = inst.type && inst.type.name.toLowerCase() || "";
	switch (typeName)
	{
		case "t233": // enemy sight range
			ctx.strokeStyle = "orange";
			break;
		case "t142": // player
			ctx.strokeStyle = "#FF007F";
			break;
		case "t113": // little bombs
		case "t117": // spiky ball
		case "t118": // spiky ball
		case "t121": // spiky oval
		case "t131": // spikes
		case "t165": //
		case "t238": // flamethrower flame
			ctx.strokeStyle = "red";
			break;
		case "t222": // enemy
			if (state != "disabled")
				ctx.strokeStyle = "red";
			break;
	}
}

function drawHitbox(ctx, inst)
{		
	if (!shouldDrawHitbox(inst))
	{
		return;
	}

	inst.update_bbox();

	ctx.save();
	setHitboxDrawState(ctx, inst);

	if (inst.collision_poly && !inst.collision_poly.is_empty())
	{
		// force fresh cache for run/crouch/animation changes
		inst.collision_poly.cache_width = -1;
		inst.collision_poly.cache_poly(inst.width, inst.height, inst.angle);

		var pts = inst.collision_poly.pts_cache;

		ctx.beginPath();
		ctx.moveTo(inst.x + pts[0], inst.y + pts[1]);

		for (var i = 2; i < pts.length; i += 2)
		{
			ctx.lineTo(inst.x + pts[i], inst.y + pts[i + 1]);
		}

		ctx.closePath();
		ctx.stroke();
	}
	else
	{
		// fallback for plain box collisions / static objects
		var q = inst.bquad;
		ctx.beginPath();
		ctx.moveTo(q.tlx, q.tly);
		ctx.lineTo(q.trx, q.try_);
		ctx.lineTo(q.brx, q.bry);
		ctx.lineTo(q.blx, q.bly);
		ctx.closePath();
		ctx.stroke();
	}

	if (debug.hitboxLabels)
	{
		ctx.font = "12px monospace";
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;

		var label = `${inst.type.name}, ${inst.layer.name}`;

		var x = inst.bbox.left;
		var y = inst.bbox.top - 4;

		ctx.strokeText(label, x, y);
		ctx.fillText(label, x, y);
	}

	ctx.restore();
}