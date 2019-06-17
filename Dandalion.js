/*var particles = [];
var alpha_value = 0;
var centerBranch;
var blowArea = 0;
var blowStrength = 0;*/

let img;

class Dandalion {
    constructor() {
        this.particles = [];
        this.alpha_value = 0;
        this.centerBranch;
        this.blowArea = 0;
        this.blowStrength = 0;
        this.hours = 0;
        this.branchColor;
    }

    init(x, y){
        this.canvas_x = x;
        this.canvas_y = y;

        textSize(12);
        for (var i = 0; i < 50; i++) {
            this.particles.push(new Particle(random(this.canvas_x), random(this.canvas_y)));
        }
        this.centerBranch = createVector(this.canvas_x / 6, this.canvas_y * 1 / 2);
    }

    getDandalionHours(tzOffset) { // 24시간제
        var now = new Date();
        var tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (tzOffset * 3600000);
        now.setTime(tz);

        var s = now.getHours() + now.getMinutes() / 60;

        this.hours = s;
    }

    getBranchColor(tzOffset){

        this.getDandalionHours(tzOffset);

        if(this.hours <= 5){
            this.branchColor = map(this.hours, 0, 5, 80, 200);
        } else if(this.hours > 5 && this.hours <= 12 ){
            this.branchColor = map(this.hours, 5, 12, 200, 255);
        } else if(this.hours > 12 && this.hours <= 16){
            this.branchColor = map(this.hours, 12, 16, 255, 200);
        } else if(this.hours > 16 && this.hours <= 20){
            this.branchColor = map(this.hours, 16, 20, 200, 100);
        } else if(this.hours > 20 && this.hours <= 24){
            this.branchColor = map(this.hours, 20, 24, 100, 80);
        }
    }

    draw(){
        if (datGuiParams.displayMode || datGuiParams.windMode) {
            push();
            strokeWeight(3);
            stroke(this.branchColor, 100);
            line(this.centerBranch.x, this.canvas_y - 15, this.centerBranch.x, this.centerBranch.y);

            strokeWeight(1);
            stroke("#7A5241");
            line(this.centerBranch.x, this.canvas_y - 15, this.centerBranch.x, this.centerBranch.y);

            pop();
        }

        for (var i = 0; i < this.particles.length; i++) {
            if (datGuiParams.displayMode) {
                this.particles[i].moveWithLerp();
            } else if (datGuiParams.windMode) {
                if (this.blowArea < datGuiParams.s + 20 / datGuiParams.test) {
                    this.blowArea += 0.001;
                }
                var distance = this.particles[i].pos.dist(this.centerBranch);
                if (distance > datGuiParams.s - this.blowArea + 20) {
                    this.particles[i].wind();
                }
            } else {
                // particles[i].checkBoundaries();
            }
            this.particles[i].update();
            this.particles[i].display(this.branchColor);
        }

        push();
        translate(this.centerBranch.x, this.centerBranch.y);
        var count = 0;
        for (var a = 0; a < TWO_PI * datGuiParams.t; a += datGuiParams.step) {
            //clock shape
            noStroke();
            // if (datGuiParams.debugMode) {
            //   alpha_value = 0;
            // } else {
            //   alpha_value = 0;
            // }
            fill(255, this.alpha_value);
            var k = datGuiParams.n / datGuiParams.d;
            var r = datGuiParams.s * cos(k * a) + datGuiParams.c;
            var x = r * cos(a) + (r / datGuiParams.p) * cos(datGuiParams.angle);
            var y = r * sin(a) + (r / datGuiParams.p) * sin(datGuiParams.angle);
            ellipse(x, y, 3, 3);
            //match
            if (count < this.particles.length) {
                this.particles[count].targetPos = createVector(x + this.centerBranch.x, y + this.centerBranch.y);
            }
            count++;
        }
        //count adjustment
        if (count < this.particles.length) {
            this.particles.pop();
        } else if (count > this.particles.length) {
            this.particles.push(new Particle(this.centerBranch.x, this.centerBranch.y));
        }
        pop();
        if (datGuiParams.debugMode) {
            // text display
            fill(255);
            text("frameRate:" + round(frameRate()), 15, 30);
            text("count:" + count, 15, 50);
            text("# of particles:" + this.particles.length, 15, 70);
            //text("r = s * cos(n / d * theta) + c", 15, 90);
            //text("x = r * cos(theta) + r / p * cos(angle)", 15, 110);
            //text("y = r * sin(theta) + r / p * sin(angle)", 15, 130);
            stroke(255);
            noFill();
            //ellipse(centerBranch.x, centerBranch.y, 2 * datGuiParams.s + datGuiParams.c, 2 * datGuiParams.s + datGuiParams.c);
            ellipse(this.centerBranch.x, this.centerBranch.y, this.blowArea, this.blowArea);
        }
    }

    getRainMode() {
        return datGuiParams.rainMode;
    }

    getSnowMode() {
        return datGuiParams.snowMode;
    }
}