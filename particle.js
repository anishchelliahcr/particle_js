var canvas =document.querySelector('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var c = canvas.getContext('2d');
c.fillStyle="rgba(255,0,0,0.26)";
var tot_pts=Math.sqrt(Math.sqrt(window.innerHeight*window.innerWidth)*Math.sqrt(window.innerHeight*window.innerHeight+window.innerWidth*window.innerWidth))/6;

function Circle(x,y,r,dx,dy)
{
    this.x=x;
    this.y=y;
    this.r=r;
    this.dx=dx;
    this.dy=dy;

    this.draw  = function ()
    {
        c.beginPath();
        c.strokeStyle="black";
        c.fillStyle="white";
        // Draw a full circle. The arc API expects start and end angles in
        // radians. The previous implementation mistakenly used `Math.PI * 2`
        // as the start angle and `false` as the end angle which resulted in an
        // invalid arc call. Start at angle `0` and end at `2 * Math.PI`.
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fill();
        c.stroke();
    }

    this.update = function ()
    {
        this.x+=this.dx;
        this.y+=this.dy;
        // Bounce the particle when it hits the canvas boundaries. Use the
        // particle's current radius instead of the last global `r` value so the
        // behaviour remains correct when the radius changes.
        if(this.x>=window.innerWidth-this.r||this.x<=this.r)
            this.dx=-this.dx;
        if(this.y>=window.innerHeight-this.r||this.y<=this.r)
            this.dy=-this.dy;
        this.draw();
    }
}
var circlearray =[];
for (var i=0;i<tot_pts;i++)
{
    var r=window.innerHeight*window.innerWidth/600000;
    var x=Math.random()*(window.innerWidth-r);
    var y=Math.random()*(window.innerHeight-r);
    var dx=(Math.random()-0.5)*4;
    var dy=(Math.random()-0.5)*4;
    circlearray.push(new Circle(x,y,r,dx,dy));
}



function animate()
{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    requestAnimationFrame(animate);
    c.clearRect(0,0,window.innerWidth,window.innerHeight);
    tot_pts=Math.sqrt(Math.sqrt(window.innerHeight*window.innerWidth)*Math.sqrt(window.innerHeight*window.innerHeight+window.innerWidth*window.innerWidth))/12;
    var valid_pts=0;

    for(var i=0;i<circlearray.length;i++)
    {
        circlearray[i].r=window.innerHeight*window.innerWidth/600000;
        if(circlearray[i].x>=0&&circlearray[i].x<=window.innerWidth&&circlearray[i].y>=0&&circlearray[i].y<=window.innerHeight)
            valid_pts++;
        circlearray[i].update();
        var larger;
        var smaller;
        if (window.innerWidth>window.innerHeight)
        {
            larger = window.innerWidth;
            smaller=window.innerHeight;
        }
        else
        {
            larger=window.innerHeight;
            smaller=window.innerWidth;
        }
        for (var j = 0; j < circlearray.length; j++)
            if (Math.sqrt(Math.pow(circlearray[i].x - circlearray[j].x, 2) + Math.pow(circlearray[i].y - circlearray[j].y, 2)) <= Math.sqrt(Math.sqrt(larger*larger+smaller*smaller)/4)*3.7 && i != j)
            {
                c.beginPath()
                c.moveTo(circlearray[i].x, circlearray[i].y);
                c.lineTo(circlearray[j].x, circlearray[j].y);
                c.stroke();
            }
    }
    if(valid_pts < tot_pts)
    {
        for(var i=0;i<tot_pts-valid_pts;i++)
        {
            var r=window.innerHeight*window.innerWidth/600000;
            var x=Math.random()*(window.innerWidth-r);
            var y=Math.random()*(window.innerHeight-r);
            var dx=(Math.random()-0.5)*4;
            var dy=(Math.random()-0.5)*4;
            circlearray.push(new Circle(x,y,r,dx,dy));
        }
    }

}
animate();
