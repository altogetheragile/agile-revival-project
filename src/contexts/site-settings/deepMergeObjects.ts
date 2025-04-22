
/**
 * Deep merges two objects.
 * If both values are objects (and not arrays/null), merge recursively.
 * Otherwise, source takes precedence.
 */
export function deepMergeObjects(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  try {
    const output = { ...target };
    if (!source || typeof source !== "object") {
      return output;
    }
    for (const key in source) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === "object" &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        output[key] = deepMergeObjects(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  } catch (error) {
    console.error("Error in deepMergeObjects:", error);
    return target;
  }
}
