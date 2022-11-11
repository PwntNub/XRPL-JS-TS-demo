const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 4;

const backgeroundLayer1 = new Image();
backgeroundLayer1.src = 'layer-1.png';
const backgeroundLayer2 = new Image();
backgeroundLayer2.src = 'layer-2.png';
const backgeroundLayer3 = new Image();
backgeroundLayer3.src = 'layer-3.png';
const backgeroundLayer4 = new Image();
backgeroundLayer4.src = 'layer-4.png';
const backgeroundLayer5 = new Image();
backgeroundLayer5.src = 'layer-5.png';

const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;
slider.addEventListener('change', function(e){
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
});

class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width){
            this.x = this.width + this.x2 - this.speed;
        }
        if(this.x2 <= -this.width){
            this.x2 = this.width + this.x - this.speed;
        }
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgeroundLayer1, 0.2);
const layer2 = new Layer(backgeroundLayer2, 0.4);
const layer3 = new Layer(backgeroundLayer3, 0.6);
const layer4 = new Layer(backgeroundLayer4, 0.8);
const layer5 = new Layer(backgeroundLayer5, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5];

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    requestAnimationFrame(animate);
};
animate();