document.addEventListener('mousemove', e => {
	let x = e.clientX;
	x += $('.main-cont').scrollLeft();
	const y = e.clientY;
	rc.send_mouse_pos(x, y);
});