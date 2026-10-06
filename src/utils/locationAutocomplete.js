export function autocompleteErrorMessage(error) {
  if (error?.status === 429) return "Too many location searches. Please wait a moment and try again.";
  if ([502, 503].includes(error?.status)) return "Location search is temporarily unavailable. You can keep browsing or try again.";
  if (error?.status === 400) return "Enter a more specific location to search.";
  return "Location search could not be completed. Check your connection and try again.";
}

export function nextAutocompleteIndex(index, key, count) {
  if (key === "Escape" || !Number.isInteger(count) || count <= 0) return -1;
  if (key === "ArrowDown") return (index + 1) % count;
  if (key === "ArrowUp") return index <= 0 ? count - 1 : index - 1;
  return index;
}

export function autocompleteListState({ open, loading, error, suggestionCount, queryLength, minQueryLength = 2 }) {
  if (!open || queryLength < minQueryLength) return "closed";
  if (loading) return "loading";
  if (error) return "error";
  return suggestionCount > 0 ? "results" : "empty";
}

export function isCurrentAutocompleteRequest(latestRequest, request) {
  return latestRequest === request;
}
