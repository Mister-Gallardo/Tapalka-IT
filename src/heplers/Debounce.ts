function Debounce(func: (args: React.TouchEvent) => void, delay: number) {
  let timeoutId: number | undefined;

  return function (...args: React.TouchEvent[]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(args[0]);
    }, delay);
  };
}

export default Debounce;
