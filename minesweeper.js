var x=40,
    y=24,
    bc=(x*y)/5,
    bombs=[],
    flags=[];

function createBoard() {
    if(document.getElementById("board")) document.getElementById("board").remove()
    var board = $("<table id=\"board\" border=0 cellspacing=0>")
    for(var i=0;i<y;i++){
        row = "<tr>"
        for(var j=0;j<x;j++){
            if((i+j)%2==0){
                row+="<td class=\"one\" id=\"x"+j+"y"+i+"\" data-x="+j+" data-y="+i+" oncontextmenu=\"return false;\"></td>"
            }
            else{
                row+="<td class=\"two\" id=\"x"+j+"y"+i+"\" data-x="+j+" data-y="+i+" oncontextmenu=\"return false;\"></td>"
            }
       }
        board.append($(row+"</tr>"))
   }
    board.append($("</table>"))
    $(document.getElementById("minesweeper") || document.body).append(board)
    
    for(var i=0;i<y;i++){
        for(var j=0;j<x;j++){
            document.getElementById("x"+j+"y"+i).addEventListener("mousedown",function(event){
                p1 = parseInt(this.getAttribute("data-x"))
                p2 = parseInt(this.getAttribute("data-y"))
                if(event.which===1){lc(p1,p2);console.log("("+p1+", "+p2+"): Left")}
                if(event.which===2){mc(p1,p2);console.log("("+p1+", "+p2+"): Middle")}
                if(event.which===3){rc(p1,p2);console.log("("+p1+", "+p2+"): Right")}
            }, false);
        }
    }
}
createBoard();
var varbs = document.querySelector(":root");
rsz();
window.addEventListener("resize",rsz,true);

//Controls Functions
function lc(c1,c2){
    self = document.getElementById("x"+c1+"y"+c2); // Get Element
    if(self.className == "b1"||self.className == "b2") return // Already-Clicked Check
    if(bombs === undefined || bombs.length == 0){initialize(c1,c2); return} // Initialize Check
    if(self.hasChildNodes() && self.firstChild.className=="flag") return // Stop click on flag
    if(bombs[c1*y+c2]){self.style.backgroundColor = "red";lose(); return} // Click a Bomb Check    
    self.className = (self.className == 'one' ? 'b1' : 'b2') // Apply Click
    count = bombcheck(c1,c2)
    if(count==0){ // Clear nearby tiles if blank
        if(c1+1<x) lc(c1+1,c2)
        if(c2+1<y) lc(c1,c2+1)
        if(c1 > 0) lc(c1-1,c2)
        if(c2 > 0) lc(c1,c2-1)
        if(c1+1<x && c2+1<y) lc(c1+1,c2+1)
        if(c1+1<x && c2 > 0) lc(c1+1,c2-1)
        if(c1 > 0 && c2+1<y) lc(c1-1,c2+1)
        if(c1 > 0 && c2 > 0) lc(c1-1,c2-1)
    }
    else if (count>0){ // Apply number to self if needed
        numerate(self,count)
    }
}
function mc(c1,c2){
    self = document.getElementById("x"+c1+"y"+c2); // Get Element
    if(self.className == "one"||self.className == "two") return // Must clear blanks
    if(self.innerHTML && flagcheck(c1,c2) == bombcheck(c1,c2)){ //Allow on numbered tiles with equal numbers flags and bombs
        if(c1+1<x) lc(c1+1,c2)
        if(c2+1<y) lc(c1,c2+1)
        if(c1 > 0) lc(c1-1,c2)
        if(c2 > 0) lc(c1,c2-1)
        if(c1+1<x && c2+1<y) lc(c1+1,c2+1)
        if(c1+1<x && c2 > 0) lc(c1+1,c2-1)
        if(c1 > 0 && c2+1<y) lc(c1-1,c2+1)
        if(c1 > 0 && c2 > 0) lc(c1-1,c2-1)
    }
}
function rc(c1,c2){
    self = document.getElementById("x"+c1+"y"+c2); // Get Element
    if(self.className == "b1"||self.className == "b2") return // Can't flag blanks
    if(bombs === undefined || bombs.length == 0) return // Can't flag while pre-initialized
    if(!self.innerHTML) {
        self.innerHTML = "<img class=\"flag\" valign=\"middle\" align=\"center\" src=\"assets/flag.png\"></img>"
        flags[c1*y+c2] = true
    }
    else {
        self.innerHTML = ""
        flags[c1*y+c2] = false
        }
}

//Mechanics Functions
function initialize(a,b){
    b1 = []; flags = [];
    SpaceReq = 20;
    if(bc/(x*y)>=(1./3.6)) SpaceReq = Math.min(15,(x*y)/10)
    else if(bc/(x*y)>=(1./5.0)) SpaceReq = Math.min(35,(x*y)/5)
    else SpaceReq = Math.min(50,(x*y)/2.5);
    console.log('Space Requirement: '+SpaceReq)
    while(b1.length < bc){
        var rand = Math.floor(Math.random()*x*y);
        if(b1.indexOf(rand) === -1) b1.push(rand);
    }
    for(i=0;i<x*y;i++){
        bombs.push(b1.includes(i)?true:false)
        flags.push(false)
    }
    if(!bombs[a*y+b]) lc(a,b);
    if((document.getElementsByClassName("b1").length+document.getElementsByClassName("b2").length)<SpaceReq) {createBoard();bombs=[];lc(a,b)}
}
function bombcheck(a,b){
    c = 0;
    if(a+1<x && bombs[(a+1)*y+b]) c++;//right
    if(b+1<y && bombs[a*y+(b+1)]) c++;//down
    if(a > 0 && bombs[(a-1)*y+b]) c++;//left
    if(b > 0 && bombs[a*y+(b-1)]) c++;//up
    if(a+1<x && b+1<y && bombs[(a+1)*y+(b+1)]) c++;//down right
    if(a+1<x && b > 0 && bombs[(a+1)*y+(b-1)]) c++;//up right
    if(a > 0 && b+1<y && bombs[(a-1)*y+(b+1)]) c++;//down left
    if(a > 0 && b > 0 && bombs[(a-1)*y+(b-1)]) c++;//up left
    return c;
}
function flagcheck(a,b){
    c = 0;
    if(a+1<x && flags[(a+1)*y+b]) c++;//right
    if(b+1<y && flags[a*y+(b+1)]) c++;//down
    if(a > 0 && flags[(a-1)*y+b]) c++;//left
    if(b > 0 && flags[a*y+(b-1)]) c++;//up
    if(a+1<x && b+1<y && flags[(a+1)*y+(b+1)]) c++;//down right
    if(a+1<x && b > 0 && flags[(a+1)*y+(b-1)]) c++;//up right
    if(a > 0 && b+1<y && flags[(a-1)*y+(b+1)]) c++;//down left
    if(a > 0 && b > 0 && flags[(a-1)*y+(b-1)]) c++;//up left
    return c; 
}
function lose(){
    alert('L you lost lol')
    for(i in bombs){//view bombs
        if(bombs[i] === true) document.getElementById("x"+Math.floor(i/y)+"y"+i%y).innerHTML = "<img class=\"mine\" valign=\"middle\" align=\"center\" src=\"assets/mine.png\"></img>";
    }
    //createBoard()
    //bombs = []
}
function numerate(elem,num){
    colors = ['#1976d2','#3a8e3d','#d33433','#7b1fa2','#ff9100','darkturquoise','black','gray']
    elem.innerHTML = num
    elem.style = "color:"+colors[num-1]
}

//Display Functions
function rsz(){
    height = $(window).height();
    width = $(window).width();
    cellsize = Math.floor(Math.min(Math.max(30,50*(8/Math.min(x,y))),0.7*width/x,0.75*height/y))
    margin = (height-(.17*height+y*(cellsize+2)))/2-1
    varbs.style.setProperty('--cell',cellsize+'px')
    varbs.style.setProperty('--font',Math.round(cellsize * .7)+'px')
    varbs.style.setProperty('--borders',border = Math.round(cellsize * .1)+'px')
    varbs.style.setProperty('--small',Math.round(cellsize * .8)+'px')
    varbs.style.setProperty('--navh',Math.floor(.1*height)+'px')
    varbs.style.setProperty('--footh',Math.floor(.07*height)+'px')
    varbs.style.setProperty('--umargin',Math.ceil(margin)+'px')
    varbs.style.setProperty('--dmargin',Math.floor(margin)+'px')
    console.log("Page Resized: "+width+", "+height)
}