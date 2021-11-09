const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");


app.use(express.static(__dirname + "/script"));
app.use(express.static(__dirname + "/css"));
app.use(express.static(__dirname + "/img"));
app.use(express.static(__dirname + "/music"));

app.use(cookieParser());


app.get("/", (req, res)=> {

    res.sendFile(__dirname + "/vue/waiting.html");

});

app.get("/champSelect", (req, res) => {

    res.sendFile(__dirname + "/vue/champSelect.html");

});

app.get("/game", (req, res) => {

    res.sendFile(__dirname + "/vue/game.html");

});


//Liste des comptes en attentes
let accountCreated = [];

let allL = 0;
let allR = 0;

let loadedPlayer = 0;


io.on("connection", (socket) => {

    // -----------------Waiting Side ---------------------

    socket.emit("listAccount", accountCreated);



    socket.on("disconnect", () => {
        const index = accountCreated.findIndex(element => element.pseudo === socket.pseudo);

        if(index > 0) {
            accountCreated.splice(index, 1);
            socket.broadcast.emit("listAccount", accountCreated);
        }

    });
    

    socket.on("pseudo", (content) => {

        let check = _checkTeam();

        if(check === 0){

            socket.pseudo = content.pseudo; //STOCKAGE SOCKET PSEUDO
            socket.team = content.team; // STOCKAGE SOCKET TEAM

            accountCreated.push({pseudo: content.pseudo, team: content.team}); //AJOUT DANS LISTE DES JOUEURS EN ATTENTE


            socket.emit("listAccount", accountCreated);
            socket.broadcast.emit("listAccount", accountCreated);

            socket.emit("saveSession", {pseudo: socket.pseudo, team: socket.team});
           
            socket.emit("saveLocal", accountCreated);
            socket.broadcast.emit("saveLocal", accountCreated);

        }

        else if(check === 1 && content.team === "Red Side") {

            socket.pseudo = content.pseudo; //STOCKAGE SOCKET PSEUDO
            socket.team = content.team; // STOCKAGE SOCKET TEAM

            accountCreated.push({pseudo: content.pseudo, team: content.team}); //AJOUT DANS LISTE DES JOUEURS EN ATTENTE


            socket.emit("listAccount", accountCreated);
            socket.broadcast.emit("listAccount", accountCreated);

            socket.emit("saveSession", {pseudo: socket.pseudo, team: socket.team});
            
            socket.emit("saveLocal", accountCreated);
            socket.broadcast.emit("saveLocal", accountCreated);
        }
        
        else if(check === 2 && content.team === "Blue Side"){

            socket.pseudo = content.pseudo; //STOCKAGE SOCKET PSEUDO
            socket.team = content.team; // STOCKAGE SOCKET TEAM

            accountCreated.push({pseudo: content.pseudo, team: content.team}); //AJOUT DANS LISTE DES JOUEURS EN ATTENTE


            socket.emit("listAccount", accountCreated);
            socket.broadcast.emit("listAccount", accountCreated);

            socket.emit("saveSession", {pseudo: socket.pseudo, team: socket.team});
            
            socket.emit("saveLocal", accountCreated);
            socket.broadcast.emit("saveLocal", accountCreated);
        }

        else{
            socket.emit("errorTeam", "Equipe selectionnee en surnombre");
        }
       

    });


    socket.on("maxPlayer", (maxPlayer) => {
        socket.broadcast.emit("maxPlayer", maxPlayer);
    });

    // -----------------CHAMPION SELECTION ---------------------
    

    socket.emit("champSelect");

    
    socket.on("loaded", (players)=> {
        loadedPlayer++;
        if(loadedPlayer === players.length){
            socket.emit("allLoaded");
            socket.broadcast.emit("allLoaded");
        }
    });

    socket.on("launchSelection", (listL, listR) => {
        _launchSelection(listL, listR, allL, allR);

    });


    socket.on("finishTurn", (listL, listR, index) => {
        if(index.team === "allL"){
            allL = index.index;
            _launchSelection(listL, listR, index.index, allR);
        }
        else if(index.team === "allR"){
            allR = index.index;
            _launchSelection(listL, listR, allL, index.index);
        }

        
    });

    function _launchSelection(listL, listR, allL, allR) {

        const nbL = listL.length;
        const nbR = listR.length;
    
        if(allL === nbL && allR === nbR){
            console.log("FINISH");
            socket.broadcast.emit("FINISH");
            socket.emit("FINISH");
        }
        else {
            if(allL === allR){
                socket.emit("yourTurn", listL[allL], {team: "allL", index: allL});
                socket.broadcast.emit("yourTurn", listL[allL], {team: "allL", index: allL});
            }
            else if(allL > allR){
                socket.emit("yourTurn", listR[allR], {team: "allR", index: allR});
                socket.broadcast.emit("yourTurn", listR[allR], {team: "allR", index: allR});
            }
            else{
            }
        }
    }


    socket.on("thinkChamp", (champion, account) => {
        socket.emit("thinkChamp", champion, account);
        socket.broadcast.emit("thinkChamp", champion, account);
    });

    socket.on("confirmChamp", (champion, account) => {
        socket.broadcast.emit("confirmChamp", champion, account);
        socket.emit("confirmChamp", champion, account);
    });

});




function _checkTeam(){



    let nbR = 0;
    let nbB = 0;

    accountCreated.forEach(element => {
        
        if(element.team === "Red Side"){
            nbR++;
        }
        else {
            nbB++;
        }
    });

    if(nbR > nbB){
        return 2;
    }
    else if(nbR<nbB){
        return 1;
    }
    else if(nbR == nbB) {
        return 0;
    }
}




server.listen(process.env.PORT || 8080, "0.0.0.0" ,() => {console.log("Server started at port : 8080");});
