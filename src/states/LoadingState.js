import RainbowText from 'objects/RainbowText';

export default class LoadingState extends Phaser.State {
	preload() {
		// let center = { x: this.game.world.centerX, y: this.game.world.centerY };
		// this.text = new RainbowText(this.game, center.x, center.y, "TINKOFF\nLoading...");
		// this.text.anchor.set(0.5);
		//this.loadingLabel = new RainbowText(this.game, center.x, center.y, "TINKOFF");
		//this.game.add.text(center.x, center.y - 100, "TINKOFF", {font: "30px Arial", fill: "#fff", align: "center"});
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
			// this.text.destroy();
			//this.loadingLabel.destroy();
		}, 100)
	}
};