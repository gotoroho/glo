const score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div');

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
};

const setting = {
	start: false,
	score: 0,
  speed: 10,
  traffic: 1
};

function getQuantityElements(heightElement) {
  return Math.ceil(document.documentElement.clientHeight / heightElement);
}

function getEnemyLeft() {
  let enemyLeft = Math.floor(Math.random() * (gameArea.offsetWidth));

  if (enemyLeft >= gameArea.offsetWidth - 25) {
    return enemyLeft -= 25;
  }

  if (enemyLeft <= 25) {
    return enemyLeft += 25;
  }

  return enemyLeft;
}

function startGame() {
	start.classList.add('hide');

	for (let i = 0; i < getQuantityElements(100) + 1; i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.y = (i + 1) * 100 ;
		line.style.top = line.y + 'px';
		gameArea.appendChild(line);
  }
  
  for (let i = 0; i < getQuantityElements(100 * setting.traffic) + 1; i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1) - 100;
    enemy.style.left = getEnemyLeft() + 'px';
    enemy.style.top = enemy.y + 'px';
    gameArea.appendChild(enemy);
  }


	setting.start = true;
	gameArea.appendChild(car);

	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	if (setting.start) {
    moveRoad();
    moveEnemy();
		if (keys.ArrowLeft && setting.x > car.offsetWidth / 2 + setting.speed) {
			setting.x -= setting.speed;
		}

		if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth / 2) - setting.speed) {
			setting.x += setting.speed;
		}

		if (keys.ArrowUp && setting.y > setting.speed) {
			setting.y -= setting.speed;
		}

		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight) - setting.speed) {
			setting.y += setting.speed;
		}

		car.style.top = setting.y + 'px';
		car.style.left = setting.x + 'px';

		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	event.preventDefault();
	keys[event.key] = true;
}

function stopRun(event) {
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  let fixedClientHeight = getQuantityElements(100) * 100;

	lines.forEach(function(item) {
    item.y += setting.speed;
    item.style.top = item.y + 'px';

    if (item.y > document.documentElement.clientHeight) {
      item.y -= fixedClientHeight + 100;
    }
	});
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  let fixedClientHeight = getQuantityElements(100 * setting.traffic) * 100 * setting.traffic;

  enemy.forEach(function(item) {
    item.y += setting.speed * 1.2;
    item.style.top = item.y + 'px';

    if (item.y > document.documentElement.clientHeight) {
      item.y -= fixedClientHeight + 100 * setting.traffic;
      item.style.left = getEnemyLeft() + 'px';
    }
	});
}