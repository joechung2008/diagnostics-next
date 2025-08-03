import { isExtensionInfo, byKey, toNavLink, when } from "../utils";

describe("utils", () => {
  describe("isExtensionInfo", () => {
    it("should return true for valid ExtensionInfo object", () => {
      const extensionInfo = {
        extensionName: "test-extension",
        version: "1.0.0",
      };
      expect(isExtensionInfo(extensionInfo)).toBe(true);
    });

    it("should return false for undefined", () => {
      expect(isExtensionInfo(undefined)).toBe(false);
    });

    it("should return false for object without extensionName", () => {
      const invalidExtension = {
        version: "1.0.0",
      } as unknown as Extension;
      expect(isExtensionInfo(invalidExtension)).toBe(false);
    });
  });

  describe("byKey", () => {
    it("should sort by key in ascending order", () => {
      const a = { key: "apple", name: "Apple", url: "" };
      const b = { key: "banana", name: "Banana", url: "" };

      expect(byKey(a, b)).toBe(-1);
      expect(byKey(b, a)).toBe(1);
      expect(byKey(a, a)).toBe(0);
    });
  });

  describe("toNavLink", () => {
    it("should convert ExtensionInfo to KeyedNavLink", () => {
      const extensionInfo = {
        extensionName: "test-extension",
        version: "1.0.0",
      };

      const result = toNavLink(extensionInfo);

      expect(result).toEqual({
        key: "test-extension",
        name: "test-extension",
        url: "",
      });
    });
  });

  describe("when", () => {
    it("should return args when condition is true", () => {
      const result = when(true, "a", "b", "c");
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should return empty array when condition is false", () => {
      const result = when(false, "a", "b", "c");
      expect(result).toEqual([]);
    });
  });
});
