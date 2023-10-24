import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface ClipboardButtonProps {
  copyText: string;
}

function ClipboardButton({ copyText }: ClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button className="copyBtn" onClick={handleCopyClick}>
      {isCopied ? (
        <CheckCircleIcon fill="none" stroke="#6499e9" />
      ) : (
        <DocumentDuplicateIcon fill="none" stroke="#6499e9" />
      )}
    </button>
  );
}

export default ClipboardButton;
