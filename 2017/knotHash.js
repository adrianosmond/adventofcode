export default (inputStr) => {
  const list = new Array(256).fill().map((_, i) => i);
  const inputArr = inputStr
    .split('')
    .map((c) => c.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);

  let pos = 0;
  let skip = 0;

  for (let round = 0; round < 64; round++) {
    for (let j = 0; j < inputArr.length; j++) {
      const clone = list.slice(0);
      const len = inputArr[j];
      let end = pos + len - 1;
      if (end >= list.length) end -= list.length;

      for (let i = 0; i < len; i++) {
        let inverse = end - i;
        if (inverse < 0) inverse += list.length;
        list[(pos + i) % list.length] = clone[inverse];
      }
      pos += len + skip;
      pos %= list.length;
      skip++;
    }
  }

  let hash = '';

  for (let outer = 0; outer < list.length; outer += 16) {
    let total = 0;
    for (let inner = 0; inner < 16; inner++) {
      total ^= list[outer + inner];
    }
    hash += total < 16 ? `0${total.toString(16)}` : total.toString(16);
  }
  return hash;
};
