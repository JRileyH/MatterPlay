// create an engine
var engine = Matter.Engine.create();

// create a renderer
var render = Matter.Render.create({
    element: document.getElementById('CanvasFrame'),
    engine: engine,
    options: {
        height:500,
        width:800
    }
});
render.options.wireframes = false;

var wallL = Matter.Bodies.rectangle(15, 250, 30, 500, { isStatic: true });
var ground = Matter.Bodies.rectangle(400, 485, 800, 30, { isStatic: true });
var wallR = Matter.Bodies.rectangle(785, 250, 30, 500, { isStatic: true });

var hoopL = Matter.Bodies.rectangle(300, 100, 10, 100, { isStatic: true });
var hoopB = Matter.Bodies.rectangle(400, 150, 200, 10, { isStatic: true });
var hoopR = Matter.Bodies.rectangle(500, 100, 10, 100, { isStatic: true });

var ball = Matter.Bodies.circle(390, 300, 20, {});
Matter.World.add(engine.world, [wallL, ground, wallR, ball, hoopL, hoopB, hoopR]);

var n = function(p,m,v){
    var dx = m.x - p.x;
    var dy = m.y - p.y;
    var ang = Math.atan2(dy,dx);
    return { x: -v*Math.cos(ang)*0.01, y: -v*Math.sin(ang)*0.01 }

}

var charging = 0;
document.getElementById('CanvasFrame').onmousedown = function(event){
    var mouse = { x: event.offsetX, y: event.offsetY };
    if(Matter.Vertices.contains(ball.vertices, mouse)){
        charging = 1;
    }
}
document.getElementById('CanvasFrame').onmouseup = function(event){
    var mouse = { x: event.offsetX, y: event.offsetY };
    if(charging){
        var calc_force = n(ball.position, mouse, charging);
        if(ball.isSleeping){
            ball.isSleeping = false;
            ball.force.x = calc_force.x;
            ball.force.y = calc_force.y;
        } else {
            ball.force.x += calc_force.x;
            ball.force.y += calc_force.y;
        }
        
    }
    charging = 0;
}

var stored_force = {x:0,y:0}
window.onkeydown = function(event){
    if(event.code==='Space'){
        if(ball.isSleeping){
            ball.isSleeping = false;
        } else {
            stored_force.x = ball.force.x;
            stored_force.y = ball.force.y;
            ball.isSleeping = true;
        }
        
    }
}

var time = 100;
var timer = 0;
var tick_orig = Matter.Runner.tick;
var tick_action = function(){
    if(charging&&charging<20)charging++;
}
var tick_overload = function(r,e,t){
    if(t-timer > time) {
        timer = t;
        tick_action();
    }
    tick_orig(r,e,t);
}
Matter.Runner.tick = tick_overload;

var runner = Matter.Runner.run(engine);

Matter.Render.run(render);