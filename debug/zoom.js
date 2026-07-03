function updateZoom(s = -1)
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
