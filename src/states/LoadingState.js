export default class LoadingState extends Phaser.State {
	preload() {
		this.game.stage.backgroundColor = "#ffdd2d";
		this.game.load.image("player", "/media/player.png");
		this.game.load.image("wall", "/media/wall.png");
		this.game.load.image("floor", "/media/floor.png");
		this.game.load.image("coin", "/media/coin.png");
		this.game.load.image("final", "/media/red-icon.png");
	}

	create() {
		setTimeout(() => {
			this.game.state.start("GameState");
		}, 100)
	}
};