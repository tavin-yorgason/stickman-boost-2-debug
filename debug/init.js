window.debug =
{
	fps: true,
	slowFix: true,
	hitboxes: false,
	hitboxLabels: false,
	zoomMultiplier: 1.0,
	fontFamily: "monospace",
	fontSize: 30,
	hitboxThickness: 2,
	playerEditMode: false,
	playerMoveSpeed: 600,
}

var isKeyDown = {};

window.addEventListener("keydown", function (e)
{
    isKeyDown[e.code] = true;
	if (isPlayerEditMoveKey(e.code) && debug.playerEditMode)
	{
        e.preventDefault();
	}

    switch (e.code)
	{
		case "F1":
            e.preventDefault();
            if (!e.repeat)
			{
				debug.slowFix = !debug.slowFix;
				console.log("Slow fix: " + debug.slowFix);
			}
			break;
        case "F2":
            e.preventDefault();
            if (!e.repeat)
            {
                debug.hitboxes = !debug.hitboxes;
                console.log("Hitboxes: " + debug.hitboxes);
            }
            break;
        case "F3":
            e.preventDefault();
            if (!e.repeat)
            {
                debug.hitboxLabels = !debug.hitboxLabels;
                console.log("Hitbox labels: " + debug.hitboxLabels);
            }
            break;
		case "F4":
            e.preventDefault();
			if (!e.repeat)
				togglePlayerEditMode();
			break;
        case "F5":
            e.preventDefault();
            if (!e.repeat)
            {
                saveCheckpoint();
                console.log("Checkpoint saved");
            }
            break;
        case "F6":
            e.preventDefault();
            if (!e.repeat)
            {
                loadCheckpoint();
                console.log("Checkpoint loaded");
            }
            break;
		case "Digit0":
            e.preventDefault();
            if (!e.repeat)
            {
                debug.zoomMultiplier = 1.0;
    			updateZoom(1);
                console.log("Zoom multiplier: " + debug.zoomMultiplier);
            }
			break;
		case "Minus":
            e.preventDefault();
			debug.zoomMultiplier = 0.9;
			updateZoom();
			console.log("Zoom multiplier: " + debug.zoomMultiplier);
			break;
		case "Equal":
            e.preventDefault();
			debug.zoomMultiplier = 1.1;
			updateZoom();
			console.log("Zoom multiplier: " + debug.zoomMultiplier);
			break;
    }
});

window.addEventListener("keyup", function (e)
{
	if (!isPlayerEditMoveKey(e.code))
		return;

	isKeyDown[e.code] = false;

	if (debug.playerEditMode)
	{
		e.preventDefault();
	}
});

function addDebugText(ctx, x_loc, y_loc, scale, fps)
{
	ctx.save();

    ctx.font = `${debug.fontSize}px ${debug.fontFamily}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = debug.fontSize / 6;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";

	var strings = [];
	if (!debug.slowFix)
		strings.push("WARNING: Slow fix disabled, game will slow if FPS < 30");
	if (debug.fps)
		strings.push("FPS: " + fps);
	if (scale != 1)
		strings.push("Zoom: " + scale.toFixed(2));

    strings.forEach(function(string, index)
	{
		if (string.length >= 20)
		{
			ctx.save();
			var fontSize = debug.fontSize * 0.8;
			ctx.font = `${fontSize}px ${debug.fontFamily}`;
			ctx.lineWidth = fontSize / 6;
			ctx.strokeStyle = "black";
			ctx.fillStyle = "orange";

			writeText(ctx, string, x_loc, y_loc - index * (fontSize + 2));
			ctx.restore();
		}
		else
		{
    		writeText(ctx, string, x_loc, y_loc - index * (debug.fontSize + 2));
		}
    });

    ctx.restore();
}
