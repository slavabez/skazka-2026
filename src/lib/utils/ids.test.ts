import { describe, expect, it } from "vitest";
import { extractRefFrom1CLink, from1CIdToGuid, fromGuidTo1CId } from "./ids";

describe("ids utils", () => {
  it("converts 1C id to guid", () => {
    expect(from1CIdToGuid("8936000c29dddd3811ecc9c9312e175a")).toBe(
      "312e175a-c9c9-11ec-8936-000c29dddd38",
    );
  });

  it("converts guid to 1C id", () => {
    expect(fromGuidTo1CId("312e175a-c9c9-11ec-8936-000c29dddd38")).toBe(
      "8936000c29dddd3811ecc9c9312e175a",
    );
  });

  it("throws for invalid 1C id length", () => {
    expect(() => from1CIdToGuid("123")).toThrow("Некорректный 1C ID");
  });

  it("throws for invalid guid length", () => {
    expect(() => fromGuidTo1CId("abc")).toThrow("Некорректный GUID");
  });

  it("extracts ref from a 1C link", () => {
    expect(
      extractRefFrom1CLink(
        "e1cib/data/Справочник.Пользователи?ref=8936000c29dddd3811ecc9c9312e175a",
      ),
    ).toBe("8936000c29dddd3811ecc9c9312e175a");
  });

  it("throws when ref is missing", () => {
    expect(() =>
      extractRefFrom1CLink("e1cib/data/Справочник.Пользователи?id=1"),
    ).toThrow("Параметр ref не найден");
  });
});
