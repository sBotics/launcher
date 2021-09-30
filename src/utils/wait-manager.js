const syncWait = (ms) => {
  const end = Date.now() + ms;
  console.log(end);
  console.log(Date.now());
  while (Date.now() < end) continue;
};

const asyncWait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export { syncWait, asyncWait };
