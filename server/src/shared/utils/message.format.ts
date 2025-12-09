export const formatMessage = (
  template: string,
  data: Record<string, string>,
): string => {
  return Object.entries(data).reduce((msg, [key, value]) => {
    return msg.replace(new RegExp(`{{${key}}}`, "g"), value);
  }, template);
};
