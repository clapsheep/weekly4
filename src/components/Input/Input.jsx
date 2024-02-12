import { forwardRef } from 'react';
import { useId } from 'react';

function Input({ onChange, value, name, ...restprops }, ref) {
  const id = useId();
  return (
    <>
      <label className=" sr-only" htmlFor={id}>
        채팅입력
      </label>
      <input
        ref={ref}
        type="text"
        placeholder="채팅을 입력하세요."
        id={id}
        name={name}
        className="border  w-full p-4"
        {...restprops}
      />
    </>
  );
}
export default forwardRef(Input);
