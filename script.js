    let container = document.querySelector('.container');
        badBox = document.querySelector('.container-box');
        arraypointer = [];
        counter = 0;
        addNewItem = '';
        lenghtTail = 100;
        devour = 0;
        flagLaser = false;
        flagLineLaser = false;
        timeSpeed = 2000;
        lose = '';
    

function startgame(){
     
    container.onmousemove = function(){
        let positionPointL = event.x - container.offsetLeft;
        let positionPointT = event.y - container.offsetTop;
    
        function renderItem() {
    
            let div = document.createElement('div');
                div.className = `point`;
                div.style.left = positionPointL -5 +'px';
                div.style.top = positionPointT -5 +'px';
                div.style.background = randColor();
                document.querySelector('.container').appendChild(div);
                
            let activePoint = document.querySelectorAll('.point')[document.querySelectorAll('.point').length - 1]; 
            addNewItem = new item( activePoint );
        }

            //Перемещение курсора и создание новых point
            if ( counter == lenghtTail) {
                arraypointer[0].item.style.left = positionPointL -5 +'px';
                arraypointer[0].item.style.top = positionPointT -5 +'px';
                arraypointer[0].item.style.background = randColor();
                arraypointer.push(arraypointer.shift());
        
            } else {
                renderItem();
                arraypointer.push(addNewItem);
                counter++;
            }
            
            //Если задели BadBox
            if (badBox.offsetLeft <= positionPointL && positionPointL <= (badBox.offsetLeft + badBox.offsetWidth) && 
                badBox.offsetTop <= positionPointT && positionPointT <= (badBox.offsetTop + badBox.offsetHeight) ) {
                    // debugger
                    lose = 'BadBox';
                    gameOver();
            } 

            //Если съели SmileyFood 
            if (arraySmileyFood[0].startoffTop <= positionPointT && positionPointT <= arraySmileyFood[0].endoffTop && 
                arraySmileyFood[0].startoffLeft <= positionPointL && positionPointL <= arraySmileyFood[0].endoffLeft ){
                newParamsSmileyFood();
                arraySmileyFood[0].item.style.display = 'none'; 
                arraySmileyFood[1].item.style.display = 'block'; 
                arraySmileyFood.push(arraySmileyFood.shift());
                lenghtTail+=1;
                devour++;
                document.querySelector('.result-statistics-devour span').innerText = devour;
        
                if( devour % 10 == 0 ) {
                    shootLaser();
        
                    if( timeSpeed > 300){
                        timeSpeed-=50; 
                    } 
                }
                
                if (devour % 15 == 0) {
                    shotLineLaser()
                }
            }

            //Когда стартует функция "shootLaser()" переменная "flagLaser" становится true и происходит проверка на касание курсора с лазерами
            if( flagLaser ){

                arrayLaser.forEach(element => {
                    let startLaserT = badBox.offsetTop + ( badBox.offsetHeight/2 ) - (-element.offsetTop +element.offsetHeight);
                    let endLaserT = badBox.offsetTop + ( badBox.offsetHeight/2 ) - (-element.offsetTop);
                    let startLaserL = badBox.offsetLeft + ( badBox.offsetWidth/2 ) - (-element.offsetLeft +element.offsetWidth);
                    let endtLaserL = badBox.offsetLeft + ( badBox.offsetWidth/2 ) - (-element.offsetLeft);

                    if ( startLaserT <= positionPointT && positionPointT <= endLaserT && 
                        startLaserL <= positionPointL && positionPointL <= endtLaserL ){
                        // debugger
                        lose = 'Laser';
                        gameOver();
                    }
                });
            }

            if( flagLineLaser ){
                arrayDangerLaser.forEach(element => {

                    let startLineLaserT = element.offsetTop;
                    let endLineLaserT = element.offsetTop + element.offsetHeight;
                    let startLinetLaserL = lineDanger.offsetLeft;
                    let endLineLaserL = lineDanger.offsetLeft + element.offsetWidth;

                    if ( startLineLaserT <= positionPointT && positionPointT <= endLineLaserT && 
                        startLinetLaserL <= positionPointL && positionPointL <= endLineLaserL ){
                        // debugger
                        lose = 'LineLaser';
                        gameOver();
                    }

                });
            }

        //Рандомное перемещение BadBox по полю
        setInterval(function() {
            $('.container-box').animate({
                'left': randomInteger(0, document.querySelector('.container').clientHeight - document.querySelector('.container-box').clientHeight)+'px',
                'top': randomInteger(0, document.querySelector('.container').clientWidth - document.querySelector('.container-box').clientWidth)+'px',
            }, timeSpeed);
        }, timeSpeed);
    }    
}      

    //Задаем съеденному бургеру новые стили    
    function newParamsSmileyFood(){
        arraySmileyFood[0].item.style.left = randomInteger(50, 650)+'px';
        arraySmileyFood[0].item.style.top = randomInteger(50, 650)+'px';
        arraySmileyFood[0].item.style.height = randomInteger(30, 70)+'px';
        arraySmileyFood[0].item.style.width = arraySmileyFood[0].item.style.height;
        arraySmileyFood[0].startoffTop = arraySmileyFood[0].item.offsetTop;
        arraySmileyFood[0].endoffTop = arraySmileyFood[0].item.offsetTop + arraySmileyFood[0].item.offsetHeight;
        arraySmileyFood[0].startoffLeft = arraySmileyFood[0].item.offsetLeft;
        arraySmileyFood[0].endoffLeft = arraySmileyFood[0].item.offsetLeft + arraySmileyFood[0].item.offsetWidth;
    }

    class item {
        constructor( item) {
            this.item = item;
        };

    }

    //Создаем Laser
    let arrayLaser = [];
    for (let i = 1; i <= 8; i++) {
        let div = document.createElement('div');
        div.className = `container-box-laser`;
        document.querySelector('.container-box').appendChild(div);
        arrayLaser.push(div); 
    }

    function shootLaser(){
        flagLaser = true;

        arrayLaser.forEach(function(item, i) {
    
            let anim = $(item).animate({
                'left': trajectoryLaser[i+1][0] +'px',
                'top': trajectoryLaser[i+1][1] +'px'
            }, timeSpeed + 1000);
    
            //После выстрела возвращаем бумеранги обратно когда закончится анимация
            $.when(anim).done(function() {
                item.style.left = 'auto';
                item.style.top = 'auto';
                flagLaser = false;
            })
        });    
    }

    //Конструктор объектов с бургерами
    let arraySmileyFood = [];
    class SmileyFood {
        constructor( item, startOffsetT, endOffsetT, startOffsetL, endOffsetL ) {

            this.item = item;
            this.startoffTop = startOffsetT;
            this.endoffTop = endOffsetT;
            this.startoffLeft = startOffsetL;
            this.endoffLeft = endOffsetL;

        };
    }

    //Создание 2 бургеров, последнего автоматически скрываем
    for(i = 0; i <= 1; i++){
        let div = document.createElement('div');
        div.className = `smileyFood`;
        div.style.left = randomInteger(50, 650)+'px';
        div.style.top = randomInteger(50, 650)+'px';
        div.style.height = randomInteger(50, 100)+'px';
        div.style.width = div.style.height;
        document.querySelector('.container').appendChild(div);

        let newSmileyFood = new SmileyFood(
            div,
            div.offsetTop,
            div.offsetTop + div.offsetHeight,
            div.offsetLeft,
            div.offsetLeft + div.offsetWidth,
        );

        arraySmileyFood.push(newSmileyFood);

    }
    arraySmileyFood[1].item.style.display = 'none';


    //Line danger 
    let lineDanger = document.querySelector('.container-line');
    lineDanger.style.left = -document.querySelector('.container-line').offsetWidth + 'px';
    let arrayDangerLaser = document.querySelectorAll('.container-line-danger');
    let arrayRandPositionLaser = [
                                        'center', 
                                        'flex-end', 
                                        'flex-start', 
                                        'space-around', 
                                        'space-between'
                                    ];

    function shotLineLaser(){
        flagLineLaser = true;
        lineDanger.style.justifyContent = arrayRandPositionLaser[randomInteger(0, 4)];
        let animLineDanger = $(lineDanger).animate({
            'left': document.querySelector('.container').offsetWidth +'px'
        }, timeSpeed + 1000);

        //После выстрела возвращаем бумеранги обратно когда закончится анимация
        $.when(animLineDanger).done(function() {
            lineDanger.style.left = -document.querySelector('.container-line').offsetWidth + 'px';
            flagLineLaser = false;
        })
    }

    //Массив значений в каком направлении полетят Laser
    let trajectoryLaser = {
        '1': [ -container.offsetHeight, -container.offsetWidth],
        '2': [ -container.offsetHeight, container.offsetWidth ],
        '3': [ container.offsetHeight, container.offsetWidth ],
        '4': [ container.offsetHeight, -container.offsetWidth ],
        '5': [ 'auto', -container.offsetWidth ],
        '6': [ container.offsetHeight, 'auto' ],
        '7': [ -container.offsetHeight, 'auto' ],
        '8': [ 'auto', container.offsetWidth ]
    }

    //Функция рандомных значений
    function randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }

    //Функция рандомного цвета
    function randColor() {
        let r = randomInteger(0, 256),
            g = randomInteger(0, 256),
            b = randomInteger(0, 256);
        return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    }


document.querySelector('.window-button').addEventListener('click', function(){
    startgame();
    document.querySelector('.window').style.display = 'none';
});

function gameOver(){
    document.querySelector('.window-endgame').style.display = 'flex';
    document.querySelector('.test').style.display = 'block';
    document.querySelector('.window-endgame-title').innerHTML = `
                                                                    <p>
                                                                        Вы задели - ${lose}
                                                                    </p>
                                                                    <p>Ваш результат - ${devour}</p>
                                                                    `;
    document.querySelector('.window-endgame-button').addEventListener('click', function(){
        window.location.href = "";
    });

}