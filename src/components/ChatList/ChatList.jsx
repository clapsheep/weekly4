function ChatList({ children }) {
  return (
    <output className=" flex flex-col gap-5 justify-end  p-8 bg-cyan-200 w-full h-full overflow-auto">
      {children}
    </output>
  );
}
export default ChatList;
