async function clipboardPaste(value) {
  await paste_text({
    text: value,
    format: 'NSPasteboardTypeString',
    insert_by_pasting: true,
  });
}

async function clipboardCopy(value) {
  await set_clipboard_content({content: value, format: 'NSPasteboardTypeString'});
}

async function popFromClipboard(top) {
  const clipboardContents = await get_clipboard_content({format: 'NSPasteboardTypeString'});
  
  if (!clipboardContents) {
    return; // Exit if clipboard is empty
  }

  const split = clipboardContents.trim().split('\n');
  if (split.length > 0) {
    let popped = top ? split[0] : split[split.length - 1];
    let newStack = top ? split.slice(1) : split.slice(0, split.length - 1);
    await clipboardPaste(`${popped}\n`);
    await clipboardCopy(newStack.join('\n'));
  }
  return clipboardContents;
}

// Add the currently highlighted text to the bottom of the stack
async function pushToStack(cut = false) {
  const clipped = await get_clipboard_content({format: 'NSPasteboardTypeString'});
  console.log('Clipboard contents:', clipped);

  const selectedText = await get_selection({format: 'NSPasteboardTypeString'});
  console.log('Selected text:', selectedText);
  
  const newStack = clipped ? `${clipped}\n${selectedText.trim()}`.trim() : selectedText.trim();
  await clipboardCopy(newStack);

  if (cut) {
    await clipboardPaste('');
  }
}

export async function clearClipboard() {
  await clipboardCopy('');
}

export async function copyToStack() {
  pushToStack(false);
  returnToBTT();
}

export async function cutToStack() {
  pushToStack(true);
  returnToBTT();
}

export async function pasteFromStack() {
  await popFromClipboard(true);
  returnToBTT();
}

export async function pasteFromStackBottom() {
  await popFromClipboard(false);
  returnToBTT();
}

export async function pasteWithCommas() {
  const clipboardContents = await get_clipboard_content({format: 'NSPasteboardTypeString'});
  
  if (!clipboardContents) {
    return; // Exit if clipboard is empty
  }

  const split = clipboardContents.trim().split('\n');
  if (split.length > 0) {
    let newStack = split.join(', ');
    await clipboardPaste(newStack);
  }
}
