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

function showHelpMenu(ctx)
{
    ctx.save();

	var fontSize = debug.fontSize * 0.8;
	ctx.font = `${fontSize}px ${debug.fontFamily}`;
	ctx.lineWidth = 1.5;
    ctx.strokeStyle = "white";

    const padding = 15;
	var x = padding;
	var y = padding + fontSize;
    const lineHeight = fontSize * 1.5;

    const strings =
	[
        "H to toggle this help menu",
        "F1 to toggle slow fix",
        "F2 to toggle hitboxes",
        "F3 to toggle player placement mode",
        "    Move player with WASD or arrow keys",
        "    Hold shift to move faster",
        "F4 to create a checkpoint",
        "F5 to load the last checkpoint",
        "- to zoom out",
        "= to zoom in",
        "0 to reset zoom",
    ];

    // Find widest line
    const maxWidth = Math.max(...strings.map(s => ctx.measureText(s).width));
    const height = strings.length * lineHeight;

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(
        x - padding,
        y - fontSize - padding,
        maxWidth + padding * 2,
        height + padding * 2
    );

    // Text
    ctx.fillStyle = "white";
    strings.forEach((string, i) => {
        writeText(ctx, string, x, y + i * lineHeight);
    });

	ctx.restore();
}