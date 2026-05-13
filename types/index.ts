export type TextBlock = {
  type: "text";
  text: string;
};

export type ImageBlock = {
  type: "image";
  source: {
    type: "base64";
    media_type: string;
    data: string;
  };
};

export type ContentBlock = TextBlock | ImageBlock;

export type Message = {
  role: "user" | "assistant";
  content: ContentBlock[];
};

export type PendingImage = {
  name: string;
  media_type: string;
  data: string;
};
