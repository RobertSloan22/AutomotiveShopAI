import React from 'react';
import { SavedConversation } from './ConversationService';

interface Props {
  conversations: SavedConversation[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

export const SavedConversationsModal: React.FC<Props> = ({
  conversations,
  onSelect,
  onClose,
}) => {
  return (
    <div className="saved-conversations-modal">
      <div className="modal-header">
        <h2>Saved Conversations</h2>
        <button onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="conversation-item"
            onClick={() => onSelect(conv.id)}
          >
            <div className="conversation-date">
              {new Date(conv.timestamp).toLocaleString()}
            </div>
            <div className="conversation-preview">
              {conv.items.length} messages
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 