import React from 'react';
import './Notes.scss';

interface NoteEntry {
  timestamp: string;
  topic: string;
  tags: string[];
  keyPoints: string[];
  codeExamples?: {
    language: string;
    code: string;
  }[];
  resources?: string[];
  actionItems?: string[];
}

interface NotesProps {
  notes: NoteEntry[];
  onSaveNote: (note: NoteEntry) => void;
  onExportNotes: () => void;
}

export const Notes: React.FC<NotesProps> = ({ notes, onSaveNote, onExportNotes }) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="content-block notes">
      <div className="content-block-title">
        Session Notes
        <button onClick={onExportNotes}>Export Notes</button>
      </div>
      <div className="content-block-body">
        {notes && notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={index} className="note-entry">
              <div className="note-header">
                <span className="timestamp">{formatTimestamp(note.timestamp)}</span>
                <span className="topic">{note.topic}</span>
                <div className="tags">
                  {note.tags?.map((tag, tagIndex) => (
                    <span key={`${index}-${tagIndex}`} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="key-points">
                <h4>Key Points:</h4>
                <ul>
                  {note.keyPoints?.map((point, idx) => (
                    <li key={`${index}-${idx}`}>{point}</li>
                  ))}
                </ul>
              </div>
              {note.codeExamples && note.codeExamples.length > 0 && (
                <div className="code-examples">
                  <h4>Code Examples:</h4>
                  {note.codeExamples.map((example, idx) => (
                    <pre key={`${index}-${idx}`}>
                      <code className={`language-${example.language}`}>
                        {example.code}
                      </code>
                    </pre>
                  ))}
                </div>
              )}
              {note.resources && note.resources.length > 0 && (
                <div className="resources">
                  <h4>Resources:</h4>
                  <ul>
                    {note.resources.map((resource, idx) => (
                      <li key={`${index}-${idx}`}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
              {note.actionItems && note.actionItems.length > 0 && (
                <div className="action-items">
                  <h4>Action Items:</h4>
                  <ul>
                    {note.actionItems.map((item, idx) => (
                      <li key={`${index}-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-notes">No notes available</div>
        )}
      </div>
    </div>
  );
}; 