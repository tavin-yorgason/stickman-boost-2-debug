var checkpoint = {};

function saveCheckpoint()
{
    var rt = cr_getC2Runtime();
    instances = getPlayerAndCameraInstance(rt);
    if (!instances)
        return;

    var player = instances.player;

    if (!player)
        return;

    checkpoint =
    {
        x: player.x,
        y: player.y
    };
}

function loadCheckpoint()
{
    var rt = cr_getC2Runtime();
    instances = getPlayerAndCameraInstance(rt);
    if (!instances)
        return;

    var player = instances.player;
    var camera = instances.camera;

    if (!player || !camera)
        return;

    player.x = checkpoint.x;
    player.y = checkpoint.y;

    camera.x = checkpoint.x;
    camera.y = checkpoint.y;
}