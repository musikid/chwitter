import { CreateMessageParams } from "common";
import { useCallback, useReducer } from "react";
import { Severity } from "../components/Toast";
import { useToast } from "../providers/ToastProvider";
import { addFriend, removeFriend } from "../services/friend";
import {
  createMessage,
  deleteMessage,
  likeMessage,
  Message,
  unlikeMessage,
} from "../services/message";
import { User } from "../services/user";

enum MessagesEventType {
  LOAD = "init",
  CREATE = "create",
  REMOVE_MSG = "removeMessage",
  LIKE = "like",
  UNLIKE = "unlike",
  ADD_FRIEND = "addFriend",
  REMOVE_FRIEND = "removeFriend",
}

interface BaseMessagesEvent {
  type: MessagesEventType;
}

interface InitEvent extends BaseMessagesEvent {
  type: MessagesEventType.LOAD;
  messages: Message[];
}

interface CreateMessageEvent extends BaseMessagesEvent {
  type: MessagesEventType.CREATE;
  message: Message;
}

interface RemoveMessageEvent extends BaseMessagesEvent {
  type: MessagesEventType.REMOVE_MSG;
  mid: Message["id"];
  index: number;
}

interface LikeEvent extends BaseMessagesEvent {
  type: MessagesEventType.LIKE;
  mid: Message["id"];
  index: number;
}
interface UnLikeEvent extends BaseMessagesEvent {
  type: MessagesEventType.UNLIKE;
  mid: Message["id"];
  index: number;
}
interface AddFriendEvent extends BaseMessagesEvent {
  type: MessagesEventType.ADD_FRIEND;
  uid: User["id"];
}
interface RemoveFriendEvent extends BaseMessagesEvent {
  type: MessagesEventType.REMOVE_FRIEND;
  uid: User["id"];
}

type MessagesEvent =
  | InitEvent
  | CreateMessageEvent
  | RemoveMessageEvent
  | LikeEvent
  | UnLikeEvent
  | AddFriendEvent
  | RemoveFriendEvent;

function reducer(
  likesMainAuthorPage: boolean,
  messages: Message[],
  action: MessagesEvent
) {
  switch (action.type) {
    case MessagesEventType.LOAD:
      return action.messages;

    case MessagesEventType.CREATE:
      return [action.message, ...messages];

    case MessagesEventType.REMOVE_MSG: {
      const { index } = action;
      return [...messages.slice(0, index), ...messages.slice(index + 1)];
    }

    case MessagesEventType.LIKE:
    case MessagesEventType.UNLIKE:
      const { index } = action;

      const before = messages.slice(0, index),
        after = messages.slice(index + 1);
      const { isLiked, likes, ...msg } = messages[index];

      return MessagesEventType.UNLIKE && likesMainAuthorPage
        ? [...before, ...after]
        : [
            ...before,
            {
              ...msg,
              isLiked: !isLiked,
              likes:
                action.type === MessagesEventType.LIKE ? likes + 1 : likes - 1,
            },
            ...after,
          ];

    case MessagesEventType.ADD_FRIEND:
    case MessagesEventType.REMOVE_FRIEND:
      const { uid } = action;

      return messages.map(({ author: { isFriend, ...author }, ...msg }) => ({
        ...msg,
        author: {
          ...author,
          isFriend: author.id == uid ? !isFriend : isFriend,
        },
      }));
  }
}

/**
 * Hook permettant de gérer l'état des messages
 * @param {boolean} likesMainAuthorPage - Active la gestion de la page des likes pour le lecteur
 */
export const useMessagesReducer = (
  likesMainAuthorPage: boolean = false
): [
  Message[],
  {
    load: (messages: Message[]) => void;
    create: (message: CreateMessageParams) => void;
    like: (mid: string, index: number) => void;
    unlike: (mid: string, index: number) => void;
    removeMessage: (mid: string, index: number) => void;
    addFriend: (uid: string) => void;
    removeFriend: (uid: string) => void;
  }
] => {
  const memoReducer = useCallback(reducer.bind(null, likesMainAuthorPage), [
    likesMainAuthorPage,
  ]);
  const [messages, dispatch] = useReducer(memoReducer, []);
  const { report } = useToast();
  const controller = new AbortController();

  return [
    messages,
    {
      load: (messages) => dispatch({ type: MessagesEventType.LOAD, messages }),
      create: (message) => {
        createMessage(message, controller.signal)
          .then((msg) =>
            dispatch({ type: MessagesEventType.CREATE, message: msg })
          )
          .catch((error) => report({ severity: Severity.ERROR, error }));
      },
      removeMessage: (mid, index) => {
        deleteMessage(mid, controller.signal)
          .then(() =>
            dispatch({ type: MessagesEventType.REMOVE_MSG, mid, index })
          )
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      like: (mid, index) => {
        likeMessage(mid, controller.signal)
          .then(() => dispatch({ type: MessagesEventType.LIKE, mid, index }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      unlike: (mid, index) => {
        unlikeMessage(mid, controller.signal)
          .then(() => dispatch({ type: MessagesEventType.UNLIKE, mid, index }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      addFriend: (uid) => {
        addFriend(uid, controller.signal)
          .then(() => dispatch({ type: MessagesEventType.ADD_FRIEND, uid }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
      removeFriend: (uid) => {
        removeFriend(uid, controller.signal)
          .then(() => dispatch({ type: MessagesEventType.REMOVE_FRIEND, uid }))
          .catch((error) => report({ severity: Severity.WARNING, error }));
      },
    },
  ];
};
