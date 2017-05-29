import LoadingState from 'states/LoadingState';
import GameState from 'states/GameState';
require('./ui.js');
import { TOTAL_HEIGHT, TOTAL_WIDTH } from './constants';
 
class Game extends Phaser.Game {
	constructor() {
		super(TOTAL_WIDTH, TOTAL_HEIGHT, Phaser.AUTO, 'content', null);

		this.state.add('GameState', GameState, false);
		this.state.add('LoadingState', LoadingState, false);

		this.state.start('LoadingState');
	}
}

new Game();
