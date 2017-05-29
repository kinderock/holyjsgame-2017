const globalEval = (function(global, realArray, indirectEval, indirectEvalWorks) {
	try {
		eval('var Array={};');
		indirectEvalWorks = indirectEval('Array') === realArray;
	} catch(err){}

	return indirectEvalWorks
		? indirectEval
		: (global.execScript
				? function(expression) {
					global.execScript(expression);
				}
				: function(expression) {
					setTimeout(expression, 0);
				}
		);
})(this, Array, eval);

const editor = ace.edit("editor");
window.editor.style.height =  screen.height - 400 + 'px';
let initialCode = document.getElementById('initial-code').innerHTML.toString();
initialCode = initialCode.replace('&gt;', '>').replace('&gt;', '>');
const previousCode = localStorage.getItem('code');
if (previousCode) {
	editor.setValue(previousCode);
} else {
	editor.setValue(initialCode);
}

editor.setFontSize(16);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.on('change', () => localStorage.setItem('code', editor.getValue()));
let game_mode;
if(game_mode = localStorage.getItem('game_mode')) {
	window.mode.checked = JSON.parse(game_mode);
}

window.mode.onchange = () => localStorage.setItem('game_mode', window.mode.checked);

window.start.onchange = () => {
	window.mode.disabled = true;
	if (!window.start.checked) {
		window.location = '/';
		return;
	}
	globalEval(editor.getValue());
};

const resultModal = document.getElementById('result-modal');

const resultModalClose = document.getElementById('result-modal-close');
export const showInfo = msg => {
	document.getElementById('result-modal-message').innerHTML = msg;
	resultModal.style.display = 'block';
};

resultModalClose.onclick = () => { resultModal.style.display = 'none'; };
const resetCodeBtn = document.getElementById('reset-code-btn');
resetCodeBtn.onclick = () => {
	if(confirm('Вы действительно хотите сбросить код?')) {
		editor.setValue(initialCode);
	}
};

const infoModal = document.getElementById('info-modal');
const infoBtn = document.getElementById('info-btn');
const infoModalClose = document.getElementById('info-modal-close');

infoBtn.onclick = () => { infoModal.style.display = 'block'; };
infoModalClose.onclick = () => { infoModal.style.display = 'none'; };

window.onclick = event => {
	if (event.target === resultModal) {
		resultModal.style.display = 'none';
	}
	if (event.target === infoModal) {
		infoModal.style.display = 'none';
	}
};

export const isFoundExitModeEnabled = () => window.mode.checked;
export const isCollectCoinsModeEnabled = () => !window.mode.checked;
export const isStrategyRunning = () => window.start.checked;
export const getSpeed = () => 1000 - window.speed.value * 100;

export const setPercents = percents => {
	if (window.scoreText.dataset.progress !== percents) {
		window.scoreText.dataset.progress = percents;
		window.percentage.innerHTML = percents + '%';
	}
};

export const setCounter = counter => {
	if (window.score.innerHTML !== counter) {
		window.score.innerHTML = counter;
	}
};