function ChatList({ children }) {
  return (
    <output className=" flex flex-col gap-5 justify-end  p-8 bg-red-100 w-full h-full overflow-auto">
      {children}
    </output>
  );
}
export default ChatList;
