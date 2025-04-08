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

async function popFromStackTop() {
  returnToBTT(await popFromClipboard(true));
}

async function popFromStackBottom() {
  await popFromClipboard(false);
  returnToBTT();
}
