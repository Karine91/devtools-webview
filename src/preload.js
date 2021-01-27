console.log('preload loaded');
function test(){
	const txt = 'some text';
	console.log('debugger test');
	return txt;
}

document.addEventListener('DOMContentLoaded', () => {
	test();
});



