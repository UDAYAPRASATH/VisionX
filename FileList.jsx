import React, { useState } from 'react';

const FileList = ({ files, onDelete }) => {
    const [previewContent, setPreviewContent] = useState(null);

    const handlePreview = async (file) => {
        // Fetch or read file content here
        // For demonstration, assuming file.content exists
        setPreviewContent(file.content || "No preview available");
    };

    const handleClosePreview = () => setPreviewContent(null);

    return (
        <div>
            <ul>
                {files.map((file, idx) => (
                    <li key={idx}>
                        {file.name}
                        <button onClick={() => handlePreview(file)}>Preview</button>
                        <button onClick={() => onDelete(file)}>Delete</button>
                    </li>
                ))}
            </ul>
            {previewContent && (
                <div className="modal">
                    <pre>{previewContent}</pre>
                    <button onClick={handleClosePreview}>Close</button>
                </div>
            )}
        </div>
    );
};

export default FileList;
