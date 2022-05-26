import input from './input24.js';

const inp = input.split('\n');

const TEAM_IMMUNE = 0;
const TEAM_INFECTION = 1;

const byPower = (a, b) =>
  b.power === a.power ? b.initiative - a.initiative : b.power - a.power;
const byInitiative = (a, b) => b.initiative - a.initiative;

const processStrengthsAndWeaknesses = (str) => {
  let s = str;
  let immuneTo = [];
  let weakTo = [];
  if (s) {
    s = s.replace('(', '');
    s = s.replace(') ', '');
    const groups = s.split('; ');
    groups.forEach((group) => {
      let g = group;
      if (g.startsWith('weak to')) {
        g = g.substring(8);
        weakTo = g.split(', ');
      } else {
        g = g.substring(10);
        immuneTo = g.split(', ');
      }
    });
  }
  return [immuneTo, weakTo];
};

const calculateDamage = (attacker, defender) => {
  if (defender.weakTo.includes(attacker.attackType)) {
    return 2 * attacker.power;
  }
  if (defender.immuneTo.includes(attacker.attackType)) {
    return 0;
  }
  return attacker.power;
};

const makeUnits = (boost) => {
  const units = [];
  let currentTeam = 0;

  inp.forEach((line, idx) => {
    if (line.includes('units')) {
      const [
        ,
        numUnits,
        hitPoints,
        strengthsWeaknesses,
        strength,
        attackType,
        initiative,
      ] = line.match(
        /(\d+) units each with (\d+) hit points (\([^)]+\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/,
      );
      const [immuneTo, weakTo] =
        processStrengthsAndWeaknesses(strengthsWeaknesses);

      const attackStrength =
        parseInt(strength, 10) + (currentTeam === TEAM_IMMUNE ? boost : 0);

      units.push({
        id: idx,
        team: currentTeam,
        numUnits: parseInt(numUnits, 10),
        hitPoints: parseInt(hitPoints, 10),
        weakTo,
        immuneTo,
        attackStrength,
        attackType,
        initiative: parseInt(initiative, 10),
        power: numUnits * attackStrength,
        targeting: -1,
        isTargeted: false,
        isDead: false,
      });
    } else if (line.startsWith('Immune System:')) {
      currentTeam = TEAM_IMMUNE;
    } else if (line.startsWith('Infection:')) {
      currentTeam = TEAM_INFECTION;
    }
  });
  return units;
};

const doFight = (boost = 0, loopLimit = false) => {
  let units = makeUnits(boost);

  let loops = 0;
  while (!loopLimit || loops < loopLimit) {
    units.sort(byPower);
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const untargetedEnemies = units.filter(
        (enemy) => enemy.team !== unit.team && enemy.isTargeted === false,
      );

      if (untargetedEnemies.length === 0) {
        continue;
      }

      const { target } = untargetedEnemies.reduce(
        (best, tgt) => {
          const damage = calculateDamage(unit, tgt);
          if (damage > best.damage) return { target: tgt, damage };
          return best;
        },
        {
          target: null,
          damage: 0,
        },
      );
      if (!target) {
        continue;
      }

      target.isTargeted = true;
      unit.targeting = target.id;
    }

    units.sort(byInitiative);
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      if (unit.isDead) {
        continue;
      }
      const [target] = units.filter((t) => t.id === unit.targeting);
      if (!target) {
        continue;
      }
      const damage = calculateDamage(unit, target);
      target.numUnits -= Math.floor(damage / target.hitPoints);
      target.power = target.numUnits * target.attackStrength;
      if (target.numUnits <= 0) {
        target.isDead = true;
      }
    }

    for (let i = 0; i < units.length; i++) {
      units[i].targeting = null;
      units[i].isTargeted = false;
    }
    units = units.filter((unit) => !unit.isDead);
    loops++;
    const immuneDead =
      units.filter((unit) => unit.team === TEAM_IMMUNE).length === 0;
    const infectionDead =
      units.filter((unit) => unit.team === TEAM_INFECTION).length === 0;
    if (immuneDead || infectionDead) {
      return [
        units.reduce((tot, unit) => tot + unit.numUnits, 0),
        infectionDead,
      ];
    }
  }
  return [-1, false];
};

const day24part2 = () => {
  for (let boost = 1; boost < 2000; boost++) {
    const [score, result] = doFight(boost, 1000);
    if (result) {
      return score;
    }
  }
  throw new Error('No boost found');
};

console.log('part1:', doFight()[0]);
console.log('part2:', day24part2());
