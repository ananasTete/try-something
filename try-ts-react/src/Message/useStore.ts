import {MessageProps, Position} from "./Message.tsx";
import {useState} from "react";

type MessageList = {
    top: MessageProps[];
    bottom: MessageProps[];
}

const initialState: MessageList = {
    top: [],
    bottom: []
}

function useStore(defaultPosition: Position = 'top') {
    const [messageList, setMessageList] = useState<MessageList>({...initialState});

    return {
        messageList,
        add: (messageProps: MessageProps) => {
            const id = getId(messageProps);

            setMessageList((prevList) => {
                if (messageProps?.id) {
                    const position = getMessagePosition(prevList, messageProps.id);
                    if (position) return prevList;
                }

                const position: Position = messageProps.position || defaultPosition;
                const isTop = position.includes('top');
                const messages = isTop
                    ? [{...messageProps, id}, ...(prevList[position] ?? [])]
                    : [...(prevList[position] ?? []), {...messageProps, id}]

                return {
                    ...prevList,
                    [position]: messages
                }
            })

            return id;

        },
        update: (id: number, messageProps: MessageProps) => {
            if (!id) return;

            setMessageList((prevList) => {
                const nextList = {...prevList};
                const {position, index} = findMessage(prevList, id);

                if (position && index !== -1) {
                    nextList[position][index] = {
                        ...nextList[position][index],
                        ...messageProps
                    }
                }

                return nextList;
            });
        },
        remove: (id: number) => {
            if (!id) return;

            setMessageList((prevList) => {
                const position = getMessagePosition(prevList, id);

                if (!position) return prevList;

                return {
                    ...prevList,
                    [position]: prevList[position].filter((item) => item.id !== id)
                }
            });
        },
        clear: () => {
            setMessageList({...initialState});
        }
    }
}

let count = 1;

function getId(messageProps: MessageProps) {
    if (messageProps.id) {
        return messageProps.id;
    }
    return ++count;
}

function getMessagePosition(messageList: MessageList, id: number): Position | undefined {
    for (const [position, list] of Object.entries(messageList)) {
        if (list.find((item) => item.id === id)) {
            return position as Position;
        }
    }
}

function findMessage(messageList: MessageList, id: number) {
    const position = getMessagePosition(messageList, id);

    const index = position ? messageList[position].findIndex((item) => item.id === id) : -1;

    return {
        position,
        index
    }
}

export default useStore;