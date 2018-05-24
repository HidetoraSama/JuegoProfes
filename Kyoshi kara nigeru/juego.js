function iniciar(){
	Crafty.init(649, 596, document.getElementById("juego"));
	
	Crafty.load({ "images" : ["images/chars.png", "images/bg.png"]}, function() {

		Crafty.sprite(33, "images/chars.png", {
			estudiante: [0, 2],
			profeBueno: [1, 1],
			profeMalo: [1, 0]
		});

		Crafty.audio.add("Pol", ["Polkka.mp3"])
		Crafty.audio.add("Hit", ["Golpe.wav"])
		Crafty.audio.add("Win", ["click.wav"])
		
		Crafty.scene("main");
	});
	
	Crafty.scene("main", function() {
		Crafty.background("url('images/bg.png')");
		Crafty.audio.play("Pol", -1);
		
		var profesorCount,lastCount,previa;

		var puntaje = Crafty.e("2D, DOM, Text")
			.attr({x: 20, y: 20, w: 350, h: 50})
			.text("Puntuación: 0 - ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
			.textFont({family: "Consolas", size: "14px", weight: "semibold"})
			.css({color: "#FFFFFF"});

		var player = Crafty.e("2D, Canvas, Controls, Collision, estudiante")
			.attr({x: 300, y: 500, w: 32, h: 32, puntaje: 0, vida: 60})
			.bind("KeyDown", function(e) {
			    if (e.key == Crafty.keys.LEFT_ARROW && this.x > 100) {
			      this.x -= 200;
			    } else if (e.key == Crafty.keys.RIGHT_ARROW && this.x < 500) {
			      this.x += 200;
			    }
			})
			.collision()
			.onHit("profesor", function(e) {

				if(e[0].obj.tipo){
					this.puntaje += 10;
					profesorCount--;
					Crafty.audio.play("Win");
				}
				else{
					this.vida -= 1;
					this.puntaje -= 5;
					Crafty.audio.play("Hit");
				}

				e[0].obj.destroy();

				var hp = "";
				for (i = 0; i < this.vida; i++)
					hp += "|";

				puntaje.text("Puntuación: " + player.puntaje + " - " + hp);

				if(profesorCount <= 0) {
					nuevosProfesores(lastCount, lastCount + 1, previa);
				}
			});
		
		Crafty.c("profesor", {   
			init: function() {
				this.attr({
					x: Crafty.math.randomInt(0, 2) * 200 + 100,
					y: Crafty.math.randomInt(0, Crafty.viewport.height - 200),
					xspeed: 0, 
					yspeed: 3, 
					rspeed: 0,
					tipo: true
				}).bind("EnterFrame", function() {
					this.x += this.xspeed;
					this.y += this.yspeed;
					this.rotation += this.rspeed;
					
					if(this._y > Crafty.viewport.height) {
						this.y = -32;
					}
					if(this._y < -32) {
						this.y = Crafty.viewport.height;
					}

				});
				
			}
		});
		
		function nuevosProfesores(lower, upper, prev) {
			var profesores = Crafty.math.randomInt(lower, upper);
			var buenos = 0;
			previa = prev;
			var spd = previa + 0.25;

			for(var i = 0; i < profesores; i++) {
				if (Crafty.math.randomInt(1, 2) % 2 == 0){
					Crafty.e("2D, Canvas, profeBueno, Collision, profesor").attr({tipo: true, yspeed: spd});
					buenos++;
				}
				else{
					Crafty.e("2D, Canvas, profeMalo, Collision, profesor").attr({tipo: false, yspeed: spd});
				}				
			}

			profesorCount = buenos;
			lastCount = profesores;
			previa = spd;

		}
		
		nuevosProfesores(5, 10, 1);
	});
}