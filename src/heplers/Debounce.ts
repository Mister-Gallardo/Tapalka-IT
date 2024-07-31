function Debounce(
  func: (event: React.TouchEvent, energy: number) => void,
  delay: number
) {
  let timeoutId: number | undefined;

  return function (...args: [React.TouchEvent, number]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(args[0], args[1]);
    }, delay);
  };
}

export default Debounce;
