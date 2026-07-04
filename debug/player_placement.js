function isPlayerEditMoveKey(code)
{
	return code === "KeyW" || code === "KeyA" || code === "KeyS" || code === "KeyD" ||
		code === "ArrowUp" || code === "ArrowLeft" || code === "ArrowDown" || code === "ArrowRight" ||
		code === "ShiftLeft" || code === "ShiftRight";
}

function togglePlayerEditMode()
{
	var rt = cr_getC2Runtime();
	var instances = getPlayerAndCameraInstance(rt);

	if (!rt || !instances)
	{
		console.log("Player edit mode unavailable: player not found");
		return;
	}

	if (debug.playerEditMode)
    {
		rt.timescale = 1;
        instances.player.collisionsEnabled = true;
        debug.playerEditMode = false;
    }
	else
    {
        rt.timescale = 0;
        instances.player.collisionsEnabled = false;
        debug.playerEditMode = true;
    }
}

function updatePlayerEditMode(rt)
{
	var instances = getPlayerAndCameraInstance(rt);
	if (!instances)
		return;

	var player = instances.player;
	var camera = instances.camera;

	var moveX = 0;
	var moveY = 0;
	if (isKeyDown["KeyA"] || isKeyDown["ArrowLeft"])
		moveX -= 1;
	if (isKeyDown["KeyD"] || isKeyDown["ArrowRight"])
		moveX += 1;
	if (isKeyDown["KeyW"] || isKeyDown["ArrowUp"])
		moveY -= 1;
	if (isKeyDown["KeyS"] || isKeyDown["ArrowDown"])
		moveY += 1;

	if (!moveX && !moveY)
		return;

	var dt = rt.dt1 || (1 / 60);
	var speed = debug.playerMoveSpeed;
	if (isKeyDown["ShiftLeft"] || isKeyDown["ShiftRight"])
		speed *= 2;
	if (moveX && moveY)
		speed *= Math.SQRT1_2;

	player.x += moveX * speed * dt;
	player.y += moveY * speed * dt;

    camera.x = player.x;
    camera.y = player.y;
}
