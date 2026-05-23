export type Message = {
  _id: string;
  content: string;
  createdAt: Date;
};

export function toClientMessage(message: {
  id: string;
  content: string;
  createdAt: Date;
}): Message {
  return {
    _id: message.id,
    content: message.content,
    createdAt: message.createdAt,
  };
}
