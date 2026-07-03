const blockedLayers =
[
    'background',
    'ui',
    'rightpanel', // some ui stuff
    'levelspage',
    'menu',
    'layer 0',    // the loading screen layer
];

const blockedTypes = 
[
    't48',  // title on last level
    't132', // ball shooter
    't164', // player walking animation
    't166', // player jetpack location
    't169', // jetpack when dropped
    't174', // coin collect animation
    't175', // broken pieces
    't176', // ball splatter
    't177', // small explosion animation
    't178', // ball splatter
    't179', // smoke
    't180', // something on the player
    't181', // something on the player
    't182', // something on the player
    't183', // player dying
    't186', // water splash animation
    't187', // broken pieces
    't190', // BOOST text
    't196', // thanks for playing text
    't198', // level directions
    't219', // motorcycle animation
    't220', // footstep animation
    't230', // explosion animation
    't231', // white water layer
    't237', // flamethrower animation
    't243', // camera
    't246', // level directions
    't247', // level directions
    't249', // black filler thing
    't250', // level directions
];

function drawHitboxes(ctx, instances)
{
	for (var i = 0, len = instances.length; i < len; i++)
	{
		drawHitbox(ctx, instances[i]);
	}
}

function shouldDrawHitbox(inst)
{
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
		ctx.strokeStyle = "cyan";   // player cannot pass
	else if (state === "pass")
		ctx.strokeStyle = "lime";   // player can pass through
	else if (state === "disabled")
		ctx.strokeStyle = "gray";

	ctx.lineWidth = debug.hitboxThickness;

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
		ctx.font = `12px ${debug.fontFamily}`;
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;

		var label = `${inst.type.name}, ${inst.layer.name}`;

		var x = inst.bbox.left;
		var y = inst.bbox.top - 4;

		writeText(ctx, label, x, y);
	}

	ctx.restore();
}
