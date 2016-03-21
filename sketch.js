// -- Global state --------------------------------
var nodes = new Array();
var connections = new Array();

// -- Constructors --------------------------------
function Connection(newConnectedNode,connectingNode) {
  this.n1 = newConnectedNode;
  this.n2 = connectingNode;

  connectingNode.isLeaf = false;
}

function Node(location) {
  this.location = location;
  this.isReached = false;
  this.isLeaf = true;
}

// -- P5.js stuff ---------------------------------
function setup() {
  createCanvas(800,480);
  
  for(var i=0; i < 80; i++) {
    nodes.push(new Node(createVector(random(width), random(height))));
  }

  prim();
}

function draw() {
  background(255);

  drawConnections();
  drawNodes();
}

// -- Events ----------------------------------------
function mousePressed() {
  nodes.push(new Node(createVector(mouseX,mouseY)));
  prim();
}

// -- Helpers ----------------------------------------
function drawNodes() {
  nodes.forEach(function(node) {
    noStroke();
    var size = 16;

    if(node.isReached) {
      fill(0,220,0);
      if(node.isLeaf) {
        stroke(0);
        size = 20;
        fill(0,255,0);
      }
    } else {
      fill(220,0,0);
    }
        
    ellipse(node.location.x, node.location.y, size, size);
  });
}

function drawConnections() {
  connections.forEach(function(connection) {
    fill(0);
    stroke(0);
    line(connection.n1.location.x, connection.n1.location.y, connection.n2.location.x, connection.n2.location.y);    
  });
}

// -- Algorithm --------------------------------------
function prim() {
  var reached = [];
  var unreached = nodes.slice();
  
  // Resetting global state
  connections = [];
  nodes.forEach(function(node) {
    node.isReached = false;
    node.isLeaf = true;
  });

  // Select a random first node
  var firstNode = unreached.splice(random(unreached.length),1)[0];
  firstNode.isReached = true;
  reached.push(firstNode);

  // Calculate one new connection
  function calculateConnection() {
    var record = width;
    var closestNode, connectingNode;

    reached.forEach(function(reachedNode) {
      unreached.forEach(function(unreachedNode) {
        var d = dist(reachedNode.location.x,reachedNode.location.y,unreachedNode.location.x,unreachedNode.location.y);

        if(d < record) {
          record = d;
          closestNode = unreachedNode;
          connectingNode = reachedNode;
        }
      });
    });

    connections.push(new Connection(closestNode,connectingNode));
    closestNode.isReached = true;
    reached.push(unreached.splice(unreached.indexOf(closestNode),1)[0]);
  }

  // Trigger calculations sequentially
  function doCalculation() {
    if(unreached.length > 0) {
      calculateConnection();
      setTimeout(doCalculation, 80);   
    } else {
      console.log("I'm done");
    }
  }

  // Bootstrap the calculation
  doCalculation();
}