export const getServerlessModuleHandlerPath = (contextDir: string) => {
  return `${contextDir.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};
