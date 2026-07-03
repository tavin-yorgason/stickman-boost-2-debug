function getPlayerAndCameraInstance(rt)
{
	if (!rt || !rt.types || !rt.types["t142"] || !rt.types["t243"])
		return null;

    if (!rt.types["t142"].instances || !rt.types["t243"].instances)
		return null;

	var player = rt.types["t142"].instances[0];
    var camera = rt.types["t243"].instances[0];
	return player && camera ? { player: player, camera: camera } : null;
}

function writeText(ctx, text, x, y)
{
	ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}
