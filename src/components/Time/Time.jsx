function Time({ time }) {
  const sendTime = time.slice(11, 16);
  return <span className=" text-[8px] text-gray-600">{sendTime}</span>;
}

export default Time;
