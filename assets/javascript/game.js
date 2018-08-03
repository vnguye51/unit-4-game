function Character(ref,name,hp,ap,cp,acc,ally,pos) {
    this.ref = ref;
    this.name = name;
    this.hp = hp;
    this.ap = ap;
    this.cp = cp;
    this.acc = acc;
    this.ally = ally;
    this.pos = pos;


    this.attack = function(target){
        $('#messagebox').empty()

        var hitroll = Math.floor(Math.random()*100) 
        var enemyroll = Math.floor(Math.random()*100)

        if (this.acc > hitroll){
            target.hp = Math.max(target.hp-this.ap,0)
            $('#messagebox').prepend('<br>' + this.name + ' dealt ' + this.ap + ' damage to ' + target.name +'. <br>')
            if (target.hp <= 0) {
                $('#messagebox').prepend('<br>' + target.name + ' falls before ' + this.name +"'s might! <br>" )
            }
        }

        else {
            $('#messagebox').prepend('<br>' + target.name + ' dodges ' + this.name + "'s attack! <br>")
        }

        if ((target.acc > enemyroll) && (target.hp > 0)) {
            this.hp = Math.max(this.hp-target.cp,0)
            $('#messagebox').prepend('<br>' + target.name + ' dealt ' + target.ap + ' damage in retaliation <br>')
        }
        else if (target.hp > 0){
            $('#messagebox').prepend('<br>' + this.name + ' dodges the retaliation! <br>')
        }

        $(this.ref).find('.label').text('HP: ' + this.hp)
        $(target.ref).find('.label').text('HP: ' + target.hp)

    };

    this.moveto = function(targetrow,targetcol){ //target should be in format '3.2' in coordinate system
        this.ref.detach()
        $('#'+targetrow+'\\.'+targetcol).append(this.ref)

    };
}

var gamegrid = [] // I might use this
for (var i = 0; i<10;i++){
    var row = []
    var rowref = $('<div>')
    rowref.addClass('row')
    for (var j = 0; j<10;j++){
        row.push(j)
        var colref = $('<div>')
        colref.addClass('col')
        rowref.append(colref)
        colref.attr('id',i+'.'+j)
    }
    gamegrid.push(row)
    $('#container').append(rowref)
}


var player = null
var target = null
var phase = 'ChooseCharacter'


//Can probably move this section directly into the one below later
var Lucina = new Character($('#lucina'),'Lucina',100,20,20,50,true, [0,0])
var Ryoma = new Character($('#ryoma'),'Ryoma',100,20,20,50,true, [1,0])
var Hector = new Character($('#hector'),'Hector',100,20,20,50,true, [2,0])
var Lyn = new Character($('#lyn'),'Lyn',100,20,20,50,true, [3,0])

var enemies = [Lucina, Ryoma, Hector, Lyn]
var allies = []

for (var i = 0; i<enemies.length;i++){
    enemies[i].ref.data(enemies[i])
    enemies[i].ref.find('.label').text('HP: ' + enemies[i].hp)
    enemies[i].moveto(i,0)
}



$(".character").on('click',function(){
    if (phase === 'ChooseCharacter'){
        player = $(this).data()
        allies.push(enemies.splice(enemies.indexOf(player),1))
        player.moveto(6,5)
        phase = 'ChooseOpponent'
        $('#messagebox').text("Choose your opponent!")

        // for(var i=0;i<enemies.length;i++){
        //     enemies[i].moveto(3,3+i)
        // }
    }
            
    else if (phase === 'ChooseOpponent'){
        phase = 'PlayerSelect'
        target = $(this).data()
        target.moveto(3,5)
    }

    else if (phase === 'PlayerSelect'){
        player = $(this).data()
        phase = 'TargetSelect'
    }


    else if (phase === 'TargetSelect'){
        phase = 'PlayerSelect'
        target = $(this).data()
        player.attack(target)

    }

        
    
});



