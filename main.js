const score = document.querySelector('.scoreContainer'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div'),
	audio = document.querySelector('.audio'),
	levelContainer = document.querySelector('.levelSelect'),
	levels = document.querySelectorAll('.level');

car.classList.add('car');

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
  speed: 0,
	traffic: 0,
	x: 0,
	y: 0
};

Object.seal(setting);

start.addEventListener('click', levelSelect);

levels[0].addEventListener('click', function() {
	setting.speed = 5;
	setting.traffic = 4;
	startGame();
});

levels[1].addEventListener('click', function() {
	setting.speed = 7;
	setting.traffic = 3;
	startGame();
});

levels[2].addEventListener('click', function() {
	setting.speed = 10;
	setting.traffic = 2;
	startGame();
});

function levelSelect() {
	start.classList.add('hide');
	levelContainer.classList.remove('hide');
}

function getQuantityElements(heightElement) {
  return Math.ceil(document.documentElement.clientHeight / heightElement);
}

function getEnemyLeft() {
  let enemyLeft = Math.floor(Math.random() * gameArea.offsetWidth);

  if (enemyLeft >= gameArea.offsetWidth - 25) {
    return enemyLeft -= 25;
  }

  if (enemyLeft <= 25) {
    return enemyLeft += 25;
  }

  return enemyLeft;
}

function startGame() {
	levelContainer.classList.add('hide');
	audio.volume = 0.1;
	audio.play();
	gameArea.innerHTML = '';
	if (localStorage.getItem('best score') == null) {
		localStorage.setItem('best score', '0');
	}
	score.childNodes[5].textContent = 'Best score: ' + localStorage.getItem('best score');
	car.style.left = gameArea.offsetWidth / 2;
	car.style.top = 'auto';
	car.style.bottom = '40px';

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

	setting.score = 0;
	setting.start = true;
	gameArea.appendChild(car);

	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	if (setting.start) {
		setting.score += setting.speed - setting.traffic;
		score.childNodes[3].textContent = setting.score;

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
		let carRect = car.getBoundingClientRect();
		let enemyRect = item.getBoundingClientRect();

		if (carRect.top <= enemyRect.bottom &&
				carRect.right >= enemyRect.left &&
				carRect.bottom >= enemyRect.top &&
				carRect.left <= enemyRect.right) {
			let bestScore = localStorage.getItem('best score');
			let userScore = setting.score;
			if (bestScore < userScore) {
				localStorage.setItem('best score', userScore);
				score.childNodes[5].textContent = 'NEW RECORD!';
			}
			setting.start = false;
			start.classList.remove('hide');
			start.style.top = score.offsetHeight;
			audio.pause();
			audio.currentTime = 0;
		}

    item.y += setting.speed * 1.2;
    item.style.top = item.y + 'px';

    if (item.y > document.documentElement.clientHeight) {
      item.y -= fixedClientHeight + 100 * setting.traffic;
			item.style.left = getEnemyLeft() + 'px';
			if (setting.score > 4000) {
				setRandomEnemy(item);
			}
    }
	});
}

function setRandomEnemy(item) {
	let randomBool = Math.random() > 0.7;
	let backgroundName = 'my_enemy';

	if (randomBool) {
		backgroundName = 'my_enemy2';
	}

	item.style.backgroundImage = `url('image/${backgroundName}.png')`;
}

