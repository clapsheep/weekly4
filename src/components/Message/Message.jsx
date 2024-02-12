import { Time } from '@/components';

function Message({ user, time, children, ...restProps }) {
  if (user === 'h8nmxf5u317o46h') {
    return (
      <div className="flex gap-2 justify-start items-end">
        <span className=" bg-white rounded p-2" {...restProps}>
          {children}
        </span>
        <Time time={time}></Time>
      </div>
    );
  } else {
    return (
      <div className="flex gap-2 justify-end items-end">
        <Time time={time}></Time>
        <span className=" bg-gray-300 rounded p-2" {...restProps}>
          {children}
        </span>
      </div>
    );
  }
}

export default Message;
