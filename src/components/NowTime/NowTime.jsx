function NowTime() {
  const today = new Date();
  const hours = today.getHours();
  let calcHours;
  if (hours === 12) {
    calcHours = `오후 ${hours}`;
  } else if (hours > 12) {
    calcHours = `오후 ${hours - 12}`;
  } else {
    calcHours = `오전 ${hours}`;
  }
  const minutes = today.getMinutes();
  let calcMinutes;
  if (minutes < 10) {
    calcMinutes = `0${minutes}`;
  } else {
    calcMinutes = minutes;
  }

  return (
    <span className=" text-[8px] text-gray-600 mr-2">
      {calcHours}:{calcMinutes}
    </span>
  );
}

export default NowTime;
