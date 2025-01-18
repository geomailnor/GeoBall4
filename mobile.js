// Вземане на системния език
const systemLanguage = navigator.language || navigator.userLanguage;
const myH1 = document.getElementById("myH1");
const perviH3 = document.getElementById("perviH3");
const vtoriH3 = document.getElementById("vtoriH3");
const lblLes = document.getElementById("lblLesno");
const lblSred = document.getElementById("lblSredno");
const lblTrud = document.getElementById("lblTrudno");

const canvas = document.getElementById("gameCanvas");
const button = document.getElementById("button");
const restartButton = document.getElementById("restartButton");
const infoBar = document.getElementById("infoBar");
const ctx = canvas.getContext("2d");
let brVragove = 2;
const BR_TOPKI = 50;
let broiki = BR_TOPKI;
// Масив за топките
let balls = [];
let playerBall = null;
let speed = 3;
let isPaused = false;
let chocar = false; // Използва се за рестартиране на играта, след сблъсък.
let btnStartPressed = false;
const katasSound = new Audio("sounds/explosion.wav");
const pobedaSound = new Audio("sounds/snakeBonus.wav");
let posoka = "i";
// Масив за противниците
let enemies = [];
let points = 0;
canvResized = false;
let broyach = 0;
let zakacheni = 0;
let fin = false;
let brFin = 0;
let enemiSkor1 = 0.5, enemiSkor2 = 1.5;
// Зареждане на текста според езика
const selectedLanguage = getLanguage();
let strHvanati = "хванати";
let strDalg = "дължина";
let strOstavashti = "оставащи";
let strIgrataENaPauza ="Играта е на пауза! Натиснете клавиш 'Пауза'";

let canvasWidth;
let canvasHeight;
let buttonSize;
let gap; // Разстояние между бутоните (3% от ширината)
let centerX;
let bottomY;
let upX;
let upY;
let leftX;
let leftY;
let rightX;
let rightY;
let downX;
let downY;
let pauseX;
let pauseY;

// Функция за запазване на избраната трудност в sessionStorage
//Тя се извиква по късно от button_click
const saveDifficulty = () => {
    const selected = document.querySelector('input[name="trudnost"]:checked'); // Избира избрания радио бутон
    if (selected) {
        sessionStorage.setItem('difficulty', selected.id); // Запазва ID на избраната трудност
    }
};

function getLanguage() {
    if (systemLanguage.startsWith('bg')) {
        return 'bg'; // Български
    } else if (systemLanguage.startsWith('no') || systemLanguage.startsWith('nb') || systemLanguage.startsWith('nn')) {
        return 'no'; // Норвежки
    } else {
        return 'en'; // Английски (по подразбиране)
    }
}
// Функция за зареждане на избраната трудност при зареждане на страницата
const loadDifficulty = () => {
    const savedDifficulty = sessionStorage.getItem('difficulty'); // Проверява дали има запазена стойност
    if (savedDifficulty) {
        const savedRadio = document.getElementById(savedDifficulty);
        if (savedRadio) {
            savedRadio.checked = true; // Маркира запазената трудност като избрана
        }
    }
};
// Добавяне на слушатели за радиобутоните
document.querySelectorAll('input[name="trudnost"]').forEach((radio) => {
    radio.addEventListener('change', saveDifficulty);
});
// Зарежда запазената трудност, когато страницата се зареди
window.addEventListener('DOMContentLoaded', loadDifficulty);
restartButton.addEventListener("click", function(){
    location.reload(); // Рестартиране на играта
});
button.addEventListener ("click", function(){
    this.style.display = "none";
    cont.style.display = "none";
    btnStartPressed = true;
    saveDifficulty(); // Запазва избора на трудност
    if(easy.checked){
        speed = 3;
        brVragove = 2;
        enemiSkor2 = 1.5;
        enemiSkor1 = 0.5;
    }
    else if(medium.checked){
        speed = 4;
        brVragove = 3;
        enemiSkor2 = 2.0;
        enemiSkor1 = 1.0;
    }
    else{
        speed = 5;
        brVragove = 4;
        enemiSkor2 = 2.5;
        enemiSkor1 = 1.5;
    }
    createEneBalls();
    drawGame();
    });

function resizeCanvas() { 
    if(fin || brFin > 0) return;
    if(canvResized === true && btnStartPressed === false && broyach > 0 ||(chocar)){
        location.reload(); // Рестартиране на играта
    }
        //Начало
        canvas.width = window.innerWidth+1;  // Задава ширината на видимия прозорец
        canvas.height = window.innerHeight - infoBar.offsetHeight+1; // Задава височината на видимия прозорец
        isPaused = false; //Igrata da prodalzhi
        canvResized = true; 
        broyach ++;

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        if(canvasWidth < canvasHeight) {
            infoBar.style.padding = "10px 0 10px 5px";//горе дясно долу ляво
            infoBar.style.textAlign = 'left';
            restartButton.textContent= "🔄";
        }
        else{
            infoBar.style.padding = "10px 0";
            infoBar.style.textAlign = 'center';
            restartButton.textContent= "Restart";
        }

        if(infoBar.style.backgroundColor = "rgba(180, 180, 180, 1)"){
            nastroiResumedGame();
        }   
        buttonSize = Math.max(canvasWidth, canvasHeight) * 0.06;
        gap = canvasWidth * 0.03; // Разстояние между бутоните (5% от ширината)
    
        centerX = canvasWidth / 2;
        bottomY = canvasHeight - 2 * buttonSize - gap;
    
        upX = centerX - buttonSize / 2;
        upY = bottomY - buttonSize; // - gap;
    
        leftX = centerX - buttonSize - gap;
        leftY = bottomY;
    
        rightX = centerX + gap;
        rightY = bottomY;
    
        downX = centerX - buttonSize / 2;
        downY = bottomY + buttonSize;// + gap;
    
        pauseX = canvasWidth - buttonSize - gap;
        pauseY = bottomY;
}
window.addEventListener("blur", function () {
    if (!isPaused && btnStartPressed) {
        isPaused = true;
        nastroiPausedGame();
        //printNaPauza();
    }
});
// Извикване на resizeCanvas при зареждане на страницата и при промяна на размера на прозореца
window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Първоначално оразмеряванe

function createBalls(){
    
    // Създаване на 50 случайни топки
for (let i = 0; i < BR_TOPKI; i++) {
    balls.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: Math.random() * (canvas.height - 30) + 15,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 15,
        isAttached: false, // Проверява дали топката е част от влакчето
    });
}
// Добавяне на топката на играча
playerBall = {
    x: canvas.width / 2,
    //y: canvas.height - 30,
    y: canvas.height + 40,
    vx: 0,
    vy: -speed,
    radius: 20,
    attachedBalls: [], // Масив за влакчето
};
}
function createEneBalls(){
    for (let i = 0; i < brVragove; i++) {
        enemies.push({
            radius: 10,
            x: Math.random() * (canvas.width - 60) + 30, // Случайна позиция по хоризонтала от 30 до (canvas.width - 30)
            y: (i===0 ? 8 : 12), // Начална y позиция
            vx: (Math.random() * enemiSkor2 + enemiSkor1) * (Math.random() < 0.5 ? -1 : 1), // Случайна странична скорост
            vy: 1.4,//Math.random() * enemiSkor2 + enemiSkor1, // Положителна скорост на падане
        });

    }
}
canvas.addEventListener("click", handleMobileControlClick);

function nastroiPausedGame(){
    //canvas.style.cursor = 'auto';
    infoBar.style.backgroundImage = "linear-gradient(to bottom, rgba(150, 150, 150, 1), rgba(80, 80, 80, 1))";
    infoBar.style.backgroundColor = "rgba(180, 180, 180, 1)";
    infoBar.style.borderTop = "2px solid rgba(120, 120, 120, 1)"; // Сива горна граница
    infoBar.style.borderBottom = "2px solid rgba(200, 200, 200, 1)"; // Светло сива долна граница
    infoBar.textContent = strIgrataENaPauza;//"Играта е на пауза! Натиснете клавиш 'Пауза'";
}
function nastroiResumedGame(){
    infoBar.style.backgroundImage = "";
    infoBar.style.backgroundColor = "";
    infoBar.style.borderTop = "2px solid #8b0000"; // Оригиналната граница
    infoBar.style.borderBottom = "2px solid #cd5c5c"; // Оригиналната граница
    updateInfoBar();
}
function checkGameOver() {
    // Проверка дали има поне една свободна топка   
    // Ако няма свободни топки, играта свършва с победа
    if (brSvobodniT() === 0) {
        brFin++;
    }
}
function narisuvaiPobedaZaguba(zagPob){
    let moiText ="";
    let bonusText=" ";
    let infoText = "";
    if(zagPob === "pobeda"){
        isPaused = true;
        fin = true;
        //canvas.style.cursor = 'auto';
        if(selectedLanguage==='bg'){
            moiText = `Победихте! Имате ${zakacheni} топки!`;
            infoText = 'Очаквайте продължение... 😉';
        }
        else if(selectedLanguage==='no'){
            moiText = `Du vant! Du har ${zakacheni} kuler!`;
            infoText = 'Snart kommer det mer... 😉';
        }
        else{
            moiText = `You won! You have ${zakacheni} balls!`;
            infoText = 'Stay tuned for more... 😉';
        }
        pobedaSound.currentTime = 0;
        pobedaSound.play();
    }
    else { //zaguba
        chocar = true;
        isPaused = true;
        //canvas.style.cursor = 'auto';
        if(selectedLanguage==='bg'){
            moiText = `Сблъсък!!! Загубихте.😞 Имате ${zakacheni} топки`;
            infoText = 'Натиснете "ПАУЗА" или Рестарт за нова игра.';
        }
        else if(selectedLanguage==='no'){
            moiText = `Kollisjon! Du tapte.😞 Du har ${zakacheni} kuler`;
            infoText = "Trykk 'PAUSE' eller Restart for et nytt spill.";
        }
        else{
            moiText = `Collision! You lost.😞 You have ${zakacheni} balls`;
            infoText = "Press 'PAUSE' or Restart for a new game.";
        }
        
        katasSound.currentTime = 0;
        katasSound.play();
    }
    
    // Задаване на стилове за текста
    let mainFontSz, bonusFontSz, infoFontSz;
    if (canvasWidth < canvasHeight) {
        mainFontSz = 'bold 1rem Arial';
        bonusFontSz = 'bold 1rem Arial';
        infoFontSz = '1rem Arial';
    } 
    else {mainFontSz = 'bold 2rem Arial';
        bonusFontSz = 'bold 1.3rem Arial';
        infoFontSz = '1.2rem Arial';
    }
    
    ctx.textAlign = 'center'; // Центрира текста хоризонтално
    ctx.textBaseline = 'middle'; // Центрира текста вертикално

    // Рисуване на сянка
    ctx.font = mainFontSz;
    ctx.fillStyle = 'gray'; // Цвят на сянката
    ctx.fillText(moiText, canvas.width / 2 + 1, canvas.height / 2.4 +2 );
    if(zakacheni === BR_TOPKI){
        if(selectedLanguage === 'bg'){
            bonusText = `Браво! 100% успеваемост! ! !`;
        }
        else if(selectedLanguage==='no'){
            bonusText = `Bra jobbet! 100% suksessrate! ! !`;
        }
        else{
            bonusText = `Bravo! 100% success rate! ! !`;
        }
        ctx.font = bonusFontSz;
        ctx.fillText(bonusText, canvas.width / 2 + 1, canvas.height / 2.4 + 52);
    }
    
    // Рисуване на основния текст
    ctx.font = mainFontSz;
    ctx.fillStyle = '#1e1e95'; // Основният цвят на текста
    ctx.fillText(moiText, canvas.width / 2, canvas.height / 2.4);
    ctx.font = bonusFontSz;
    ctx.fillText(bonusText, canvas.width / 2, canvas.height / 2.4 + 50);
    
    ctx.font = infoFontSz;
    ctx.fillStyle ='#555';
    ctx.fillText(infoText, Math.round(canvas.width / 2), Math.round(canvas.height * 4 / 5));

}
function brSvobodniT(){
    const freeBalls = balls.filter(ball => !ball.isAttached);
    return freeBalls.length;
}

function playMoveSound(path) {
    if(isPaused === false){
        const moveSoundInstance = new Audio(path);
        moveSoundInstance.play();
    }
}
function updateInfoBar() {
    if(!btnStartPressed){
        broiki= BR_TOPKI;
    }
    else{broiki= brSvobodniT();}
    infoBar.textContent = `${strHvanati}: ${points} | ${strDalg}: ${zakacheni} | ${strOstavashti}: ${broiki}`;
}
// увеличаване на точките:
function increasePoints(amount) {
    points += amount;
    updateInfoBar();
}
//Заобля рамките на бутоните
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); // Започваме от горния ляв ъгъл с радиус
    ctx.lineTo(x + width - radius, y); // Горна страна
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius); // Горен десен ъгъл
    ctx.lineTo(x + width, y + height - radius); // Дясна страна
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); // Долен десен ъгъл
    ctx.lineTo(x + radius, y + height); // Долна страна
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius); // Долен ляв ъгъл
    ctx.lineTo(x, y + radius); // Лява страна
    ctx.quadraticCurveTo(x, y, x + radius, y); // Горен ляв ъгъл
    ctx.closePath(); // Затваряме пътя
}

    function drawMobileControls() {   
        // Рисуване на бутоните
        ctx.fillStyle = "rgba(192, 192, 192, 0.6)"; // Полупрозрачен светлосив цвят
        ctx.fillRect(upX, upY, buttonSize, buttonSize); // Up
        ctx.fillRect(leftX, leftY, buttonSize, buttonSize); // Left
        ctx.fillRect(rightX, rightY, buttonSize, buttonSize); // Right
        ctx.fillRect(downX, downY, buttonSize, buttonSize); // Down
        ctx.fillRect(pauseX, pauseY, buttonSize, buttonSize); // Pause
        // Рамка около бутоните
        ctx.strokeStyle = "rgba(255, 79, 59, 0.8)"; // Червена рамка
        ctx.lineWidth = 2; // Дебелина на рамката
        const radi = 10;

        // Начертаване на рамките със заоблени ъгли
        drawRoundedRect(ctx, upX, upY, buttonSize, buttonSize, radi);
        ctx.stroke();
        drawRoundedRect(ctx, leftX, leftY, buttonSize, buttonSize, radi);
        ctx.stroke();
        drawRoundedRect(ctx, rightX, rightY, buttonSize, buttonSize, radi);
        ctx.stroke();
        drawRoundedRect(ctx, downX, downY, buttonSize, buttonSize, radi);
        ctx.stroke();
        drawRoundedRect(ctx, pauseX, pauseY, buttonSize, buttonSize, radi);
        ctx.stroke();   
        // Текст върху бутоните
        ctx.fillStyle = "rgba(255, 79, 59, 0.8)";//червено
        //ctx.font = `${Math.floor(buttonSize * 0.5)}px "Segoe UI Symbol"`; // Размерът на шрифта е 50% от височината на бутоните
        ctx.font = `bold ${Math.floor(buttonSize * 0.5)}px "Impact"`; // Размерът на шрифта е 50% от височината на бутоните
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.fillText("↑", upX + buttonSize / 2, upY + buttonSize / 2);
        ctx.fillText("←", leftX + buttonSize / 2, leftY + buttonSize / 2);
        ctx.fillText("→", rightX + buttonSize / 2, rightY + buttonSize / 2);
        ctx.fillText("↓", downX + buttonSize / 2, downY + buttonSize / 2);
        ctx.font = `bold ${Math.floor(buttonSize * 0.3)}px Arial`;
        ctx.fillText("Pause", pauseX + buttonSize / 2, pauseY + buttonSize / 2);
    }
    function handleMobileControlClick(event) {
        let zvukPath = "sounds/snakeZavoj.wav";
    
        // Изчисляване на размерите на canvas-а и позициите на бутоните
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;  
        // Проверка за клик върху бутоните
        if (x > upX && x < upX + buttonSize && y > upY && y < upY + buttonSize) {
            // Up button
            if (posoka !== "i") {
                playerBall.vx = 0;
                playerBall.vy = -speed;
                playMoveSound(zvukPath);
                posoka = "i";
            }
        } else if (x > leftX && x < leftX + buttonSize && y > leftY && y < leftY + buttonSize) {
            // Left button
            if (posoka !== "j") {
                playerBall.vx = -speed;
                playerBall.vy = 0;
                playMoveSound(zvukPath);
                posoka = "j";
            }
        } else if (x > rightX && x < rightX + buttonSize && y > rightY && y < rightY + buttonSize) {
            // Right button
            if (posoka !== "k") {
                playerBall.vx = speed;
                playerBall.vy = 0;
                playMoveSound(zvukPath);
                posoka = "k";
            }
        } else if (x > downX && x < downX + buttonSize && y > downY && y < downY + buttonSize) {
            // Down button
            if (posoka !== "m") {
                playerBall.vx = 0;
                playerBall.vy = speed;
                playMoveSound(zvukPath);
                posoka = "m";
            }
        } else if (x > pauseX && x < pauseX + buttonSize && y > pauseY && y < pauseY + buttonSize) {
            // Pause button
            if (btnStartPressed) {
                if (chocar === true || fin === true) {
                    location.reload(); // Рестартиране на играта
                }
                isPaused = !isPaused; // Превключва между пауза и игра
                if (isPaused) {
                    nastroiPausedGame();
                } else {
                    nastroiResumedGame();
                }
            }
        }
    }
    
function drawGame() {
    if (isPaused === false && chocar === false) { 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Рисуване на топката на играча
        const gradient0 = ctx.createRadialGradient(playerBall.x - 6, playerBall.y - 6, 3, playerBall.x, playerBall.y, playerBall.radius);
        gradient0.addColorStop(0, "white");
        gradient0.addColorStop(0.5, "#57ff57");
        gradient0.addColorStop(1, "darkgreen");
        ctx.beginPath();
        ctx.arc(Math.round(playerBall.x), Math.round(playerBall.y), playerBall.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient0;
        ctx.fill();
        ctx.closePath();

        if(!isPaused){
        // Проверка за края на играта
        checkGameOver(); // Извикваме проверката за свободни топки
        // Актуализиране на позицията на играча
        playerBall.x += playerBall.vx;
        playerBall.y += playerBall.vy;

        // Ограничаване в границите на canvas
            if (playerBall.x < playerBall.radius) {playerBall.x = playerBall.radius;}
            if (playerBall.x > canvas.width - playerBall.radius) {playerBall.x = canvas.width - playerBall.radius;}
            if (playerBall.y < playerBall.radius) {playerBall.y = playerBall.radius;}
            if (playerBall.y > canvas.height - playerBall.radius && btnStartPressed) {playerBall.y = canvas.height - playerBall.radius; }
        }

        // Ако brFin е по-голямо от 0, спираме да рисуваме противниковите топки
        if (brFin < 1) {
            // Рисуване на противниковите топки

            enemies.forEach((enemy, index) => {
            const gradiEnem = ctx.createRadialGradient(enemy.x - 3, enemy.y - 3, 2, enemy.x, enemy.y, enemy.radius);
            gradiEnem.addColorStop(0, "white");
            gradiEnem.addColorStop(0.5, "#999");
            gradiEnem.addColorStop(1, "black");
            ctx.beginPath();
            ctx.arc(Math.round(enemy.x), Math.round(enemy.y), enemy.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradiEnem;
            ctx.fill();
            ctx.closePath();

            // Актуализиране на позицията на противника
            enemy.y += enemy.vy;
            enemy.x += enemy.vx;
            //Противниковите топки да отскачат
            if (enemy.x < enemy.radius || enemy.x > canvas.width - enemy.radius) enemy.vx *= -1;
            if (enemy.y < enemy.radius || enemy.y > canvas.height - enemy.radius) enemy.vy *= -1;
                // Проверка за сблъсък с играча
                const dx = playerBall.x - enemy.x;
                const dy = playerBall.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Проверка за сблъсък с опашката
                let zvukCortar = "sounds/minus.wav";
                playerBall.attachedBalls.forEach((attachedBall, attachedIndex) => {
                    const dxTail = attachedBall.x - enemy.x;
                    const dyTail = attachedBall.y - enemy.y;
                    const distanceTail = Math.sqrt(dxTail * dxTail + dyTail * dyTail);
                    if (distanceTail < attachedBall.radius + enemy.radius) {
                        // Премахване на част от опашката
                        playerBall.attachedBalls.splice(attachedIndex);
                        zakacheni = playerBall.attachedBalls.length;
                        playMoveSound(zvukCortar);
                        updateInfoBar();
                    }
                });
                let buffer = 4;
                if (distance < playerBall.radius + enemy.radius - buffer) {
                    //alert("Game Over!");
                    chocar = true;
                }
            });
        }

        // Рисуване и актуализиране на топките
        balls.forEach((ball) => {
            if (!ball.isAttached) {
                const gradient = ctx.createRadialGradient(ball.x - 6, ball.y - 6, 5, ball.x, ball.y, ball.radius);
                gradient.addColorStop(0, "white");
                gradient.addColorStop(0.3, "orange");
                gradient.addColorStop(1, "darkred");
                ctx.beginPath();
                ctx.arc(Math.round(ball.x), Math.round(ball.y), ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
                if(btnStartPressed === false) return;
                // Актуализиране на позицията
                ball.x += ball.vx;
                ball.y += ball.vy;
                // Отскачане от стените
                if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.vx *= -1;
                if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) ball.vy *= -1;

                // Проверка за близост на свободн. топка с играча
                const dx = playerBall.x - ball.x;
                const dy = playerBall.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance - 15 < playerBall.radius + ball.radius) {
                    let zvukHam = "sounds/ham.wav";
                    ball.isAttached = true;
                    playerBall.attachedBalls.push(ball);
                    zakacheni = playerBall.attachedBalls.length;
                    increasePoints(1); // Увеличаване на точките
                    playMoveSound(zvukHam);
                }
            }
        });

        // Рисуване на влакчето
        let prevX = playerBall.x;
        let prevY = playerBall.y;
        playerBall.attachedBalls.forEach((attachedBall, index) => {
            const followSpeed = 0.2;
            attachedBall.x += (prevX - attachedBall.x) * followSpeed;
            attachedBall.y += (prevY - attachedBall.y) * followSpeed;

            const gradientA = ctx.createRadialGradient(attachedBall.x - 4, attachedBall.y - 4, 3, attachedBall.x, attachedBall.y, attachedBall.radius);
            gradientA.addColorStop(0, "white");
            gradientA.addColorStop(0.3, "#ffff6f");
            gradientA.addColorStop(1, "#9f9f01");
            const gradientB = ctx.createRadialGradient(attachedBall.x - 4, attachedBall.y - 4, 3, attachedBall.x, attachedBall.y, attachedBall.radius);
            gradientB.addColorStop(0, "white");
            gradientB.addColorStop(0.3, "#ff8989");
            gradientB.addColorStop(1, "darkred");
            ctx.beginPath();
            ctx.arc(Math.round(attachedBall.x), Math.round(attachedBall.y), attachedBall.radius, 0, Math.PI * 2);
            ctx.fillStyle = index % 2 === 0 ? gradientA : gradientB;
            ctx.fill();
            ctx.closePath();

            prevX = attachedBall.x;
            prevY = attachedBall.y;
        });
        drawMobileControls();
        if(chocar === true){
            updateInfoBar();
            narisuvaiPobedaZaguba("zaguba"); //chocar става true
            //return;
        };
        if(brFin > 30){
            brFin = 2;
            narisuvaiPobedaZaguba("pobeda");
            //return;
        }
    }
    if(btnStartPressed){
        requestAnimationFrame(drawGame);
    }
}
function dobaviAngl(){
    myH1.textContent="Let's play 'Magnetic Balls'";
    perviH3.childNodes[0].textContent ="Controls - with buttons ";
    vtoriH3.childNodes[0].textContent = "Pause the game - with the '";
    vtoriH3.childNodes[1].textContent ="PAUSE";
    vtoriH3.childNodes[2].textContent ="' - button.";
    lblLes.textContent = "Easy";
    lblSred.textContent = "Medium";
    lblTrud.textContent = "Hard";
    button.textContent = "Start";
    strHvanati = "caught";
    strDalg = "length";
    strOstavashti = "remaining";
    updateInfoBar();
    //restartButton.textContent = "Restart";
    strIgrataENaPauza = "The game is paused! Press the 'Pause' key";
}

function dobaviNorsk(){
    myH1.textContent="La oss spille 'Magnetiske kuler'";
    perviH3.childNodes[0].textContent ="Kontroll - med knappene ";
    vtoriH3.childNodes[0].textContent = "Pause spillet - med '";
    vtoriH3.childNodes[1].textContent ="PAUSE";
    vtoriH3.childNodes[2].textContent ="' - knappen.";
    lblLes.textContent = "lett";
    lblSred.textContent = "middels";
    lblTrud.textContent = "vanskelig";
    button.textContent = "Start";
    strHvanati = "fanget";
    strDalg = "lengde";
    strOstavashti = "gjenstår";
    updateInfoBar();
    //restartButton.textContent = "Restart";
    strIgrataENaPauza = "Spillet er på pause! Trykk på 'Pause'-tasten";
}
if (selectedLanguage === 'en') {
    // Добави английски текст
    dobaviAngl();
} else if (selectedLanguage === 'no') {
    dobaviNorsk();// Добави норвежки текст
}
createBalls();
drawGame();
